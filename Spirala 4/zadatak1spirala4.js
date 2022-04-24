const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
var path = require('path');
const ajax = require('./AjaxPozivi.js');
const TestoviParser = require('./testoviParser.js');

const Sequelize = require('sequelize');
const sequelize = require('./baza.js');
const Student = require('./student')(sequelize, Sequelize.DataTypes);
const Vjezba = require('./vjezba')(sequelize, Sequelize.DataTypes);
const Grupa = require('./grupa')(sequelize, Sequelize.DataTypes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({type: "text/plain"}));
app.use(express.static('./'))

const { Op } = require("sequelize");
sequelize.sync();

Student.belongsTo(Grupa, { foreignKey: 'grupa', through: 'Student' });

function call(error,data){
  if(error == null){
    console.log(data);
    return data;
  }
  else{
    console.log(error);
    return error;
  }
}

  app.post('/proba/ruta', (req, res) => {
   //  ajax.posaljiStudent(req.body,call);
    // res.sendFile(path.join(__dirname + '/unosStudenta.html'));
   // ajax.posaljiStudente("neko,nekic,91,2" +"\n" + "drugi,drugic,101,5456"+"\n" + "treci,trecic,7,5",call);
  //  ajax.postaviGrupu("125","9",call); 
   // ajax.postaviVjezbe(3,call);
 //  ajax.postaviTestReport("123","1",par1,call);
 });


 app.post('/student',(req, res) => {
  var x=req.body;
  x=JSON.parse(JSON.stringify(x));
  var postoji  =0;
  var imaGrupa=0;

  Student.findAll().then((rezultat) => {//provjera ima li student
    for(var i=0;i<rezultat.length;i++){
      if(rezultat[i].dataValues.index == x.index){
        postoji = 1;
        break;
      }
    }

    Grupa.findAll().then((rezultat2) =>{ //provjera ima li grupa
      for(var i=0;i<rezultat2.length;i++){
        if(rezultat2[i].dataValues.grupa == x.grupa){
          imaGrupa = 1;
      }
    }

    if(imaGrupa == 0 && postoji==0){//ako nema grupe i nema studenta
      Grupa.create({
        grupa : x.grupa
      }).then(() => {
        Grupa.findAll().then((rezultat3) =>{
          for(var i=0;i<rezultat3.length;i++){
            if(rezultat3[i].dataValues.grupa == x.grupa){ 
              if(postoji == 0){ // ako ne postoji student kreiraj ga sa poslanom grupom koju smo vec kreirali ako je nema
                Student.create({
                  ime:x.ime, prezime:x.prezime, index:x.index, grupa:i+1
                  }).then(() => {
                  res.status(200).send("Kreiran student!");
                  }).catch((err)=>{
                      conosle.log(err);
                  })
                  postoji = 1;
                }
            }
          } 
        });
    })
}
else if(imaGrupa==1 && postoji==0){ //ako ima grupe i nema studenta
  Grupa.findAll().then((rezultat3) =>{
    for(var i=0;i<rezultat3.length;i++){
      if(rezultat3[i].dataValues.grupa == x.grupa){
        if(postoji == 0){ // ako ne postoji student kreiraj ga sa poslanom grupom koja vec postoji u tabeli Grupa
          Student.create({
            ime:x.ime, prezime:x.prezime, index:x.index, grupa:i+1
            }).then(() => {
              res.status(200).send("Kreiran student!");
            }).catch((err)=>{
                conosle.log(err);
            })
            postoji = 1;
          }
      }
    }
    });
}
else{ //ako ne postoji student nema potrebe da kreiramo ni grupu u tabeli Grupa
  res.status(404).send("Student sa indeksom {" + x.index + "} vec postoji!");
}
});
});
});


app.put('/student/:index', (req, res) => {
  var x=req.body;
  x=JSON.parse(JSON.stringify(x));
  var trazeniIndeks = req.url.substr(9);// ukoliko se salje preko postmana direktno na rute => substr(9)
//  var trazeniIndeks = req.url.substr(15); //ukoliko se salje preko ajax funkcija =>substr(15)
  var trazenaGrupa = x.grupa;
  
  var postoji  =0;
  var imaGrupa = 0;

  Student.findAll().then((rezultat) => {
    for(var i=0;i<rezultat.length;i++){
      if(rezultat[i].dataValues.index == trazeniIndeks){
        postoji = 1;
        break;
      }
    }
    Grupa.findAll().then((rezultat2) =>{ 
      for(var i=0;i<rezultat2.length;i++){
        if(rezultat2[i].dataValues.grupa == trazenaGrupa){
          imaGrupa = 1;
      }
    }
    if(imaGrupa == 0 && postoji==1){//ako nema grupe,a postoji student kreiraj je
      Grupa.create({
        grupa : trazenaGrupa
      }).then(() => {
        Grupa.findAll().then((rezultat3) =>{
          for(var i=0;i<rezultat3.length;i++){
            if(rezultat3[i].dataValues.grupa == trazenaGrupa){//trazi postoji li grupa u tabeli
              if(postoji == 1){ // ako student postoji promijeni mu grupu
                Student.update({
                  grupa: i+1
                  },{ where: { index: trazeniIndeks}}).then(() => {
                  res.status(200).send("Promjenjena grupa studentu {"+trazeniIndeks+"}");
                  }).catch((err)=>{
                      console.log(err);
                  })
                }
            }
          } 
        });
    })
}
else if(imaGrupa==1 && postoji==1){//ako ima grupe i ima student uradi update studenta
  Grupa.findAll().then((rezultat3) =>{
    for(var i=0;i<rezultat3.length;i++){
      if(rezultat3[i].dataValues.grupa == trazenaGrupa){
        if(postoji == 1){ // ako postoji student update
          Student.update({
            grupa: i+1
            },{ where: { index: trazeniIndeks}}).then(() => {
            res.status(200).send("Promjenjena grupa studentu {"+trazeniIndeks+"}");
            }).catch((err)=>{
                console.log(err);
            })
          }
      }
    }
    });
}
else{//ako nema studenta ne treba ni grupu napraviti
  res.status(404).send("Student sa indeksom {"+ trazeniIndeks + "} ne postoji");
}
});
});
});

//pomocna promise funkcija
function proba(red) {
  return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var podaci = red.split(",");
        var imaGrupa=0;
        var postoji=0;
        var brojac=0;
        var dodani=0;

        Student.findAll().then((rezultat) => {
          for(var i=0;i<rezultat.length;i++){
            if(rezultat[i].dataValues.index == podaci[2]){
              postoji = 1;
              break;
            }
          }
        Grupa.findAll().then((rezultat2) =>{
          for(var i=0;i<rezultat2.length;i++){
            if(rezultat2[i].dataValues.grupa == podaci[3]){
              imaGrupa=1;
            }
          }
          
          if(imaGrupa == 0 && postoji==0){
            Grupa.create({
              grupa : podaci[3]
            }).then(() => {
              Grupa.findAll().then((rezultat3) =>{
                for(var i=0;i<rezultat3.length;i++){
                  if(rezultat3[i].dataValues.grupa == podaci[3]){ 
                    if(postoji == 0){ 
                      Student.create({
                        ime:podaci[0], prezime:podaci[1], index:podaci[2], grupa:i+1
                        }).then(() => {
                          //console.log()
                        }).catch((err)=>{
                          //  conosle.log(err);
                        })
                        postoji = 1;
                        dodani++;
                        resolve(dodani);
                      }
                  }
                } 
              });
          })
      }
      else if(imaGrupa==1 && postoji==0){
        Grupa.findAll().then((rezultat3) =>{
          for(var i=0;i<rezultat3.length;i++){
            if(rezultat3[i].dataValues.grupa == podaci[3]){
              if(postoji == 0){ 
                Student.create({
                  ime:podaci[0], prezime:podaci[1], index:podaci[2], grupa:i+1
                  }).then(() => {
                  //  res.status(200).send("Kreiran student!");
                  }).catch((err)=>{
                    //  conosle.log(err);
                  })
                  postoji = 1;
                  dodani++;
                  resolve(dodani);
                }
            }
          }
          });
      }
      else{//nije dodan student
        brojac++;
        reject(brojac);
      }
    });
  });
    }, 2000);
    
  });
}

var proba1 = function (x) {
  return x;
}
var proba2 = function (x) {
  return x;
}


app.post('/batch/student',(req,res)=>{
  var x=req.body;
  x=JSON.parse(JSON.stringify(x));
  x = x.split("\n");

   var podaci=[];
    var N=0;
    var postojeciIndeksi = [];
    var redni=0;
    for(var i=0;i<x.length;i++){
      podaci = x[i].split(",");
    Student.findAll().then((rezultat) => {
      for(var i=0;i<rezultat.length;i++){
        if(rezultat[i].dataValues.index == podaci[2]){
          postojeciIndeksi[redni]=podaci[2];
          redni++;
          istina++;
          N++;
        }
      }
});
}

if(N==0){
  var s = [];
  var podaci2=[];
  for(var i=0;i<x.length;i++){
    podaci2 = x[i].split(",");
    if(i!=x.length-1){
    s+=podaci2[2];
    s+=",";
   }
   else{
    s+=podaci2[2];
  }
} 

for(var i=0;i<x.length;i++){
  broj = x.length;
  var nisuDodani=0;
  var jesuDodani=0;
  podaci = x[i].split(",");
  proba(x[i]).then(proba1(()=>{
    jesuDodani++;
    if(jesuDodani==broj){
      res.status(200).send("Dodano {" + jesuDodani + "} studenata!");
    }
  }),proba2(()=>{
      nisuDodani++;
      if(nisuDodani==broj){
        res.status(404).send("Dodano {0} studenata,a studenti {"+ s + "} već postoje!");
      }
  })
  );

}
}
});

  
app.post('/vjezbe', (req, res) => {
  var x=req.body;
  x=JSON.parse(JSON.stringify(x));
      var novi = x.brojVjezbi;
      if(novi<=0){
        res.status(404).send("Greška prilikom kreiranja vježbi!");
        return;
      }
        var indeksi =[];
        var tacnost ="0%";
        var promjena="0%";
        var greske = "[]";
        var testovi="[]";
        var broj=0; 

        Vjezba.destroy({ //ukoliko drugi put posaljemo veci brojVjezbi u odnosu na prvi,tabela treba da izgleda kao da je prvi put poslano
          where: {},
          truncate: true
        })
        Student.findAll().then(function(rezultat) {
          broj = rezultat.length;
          for(var j = 0; j < rezultat.length;j++){
          indeksi[j] = rezultat[j].dataValues.index;
          }
        for(var i=0;i<broj;i++){
          for(var j=0;j<novi;j++){
            Vjezba.create({
              index:indeksi[i],vjezba:j+1,tacnost:tacnost,promjena:promjena,greske:greske,testovi:testovi
              }).then(() => {
                  res.status(200).send("Uspjesno kreirane vjezbe!");
              })
              .catch(err => {
                 res.status(404).send("Greška prilikom kreiranja vježbi!");
              });
          }
      }
});
});
   

app.post('/student/:index/vjezba/:vjezba', (req, res) => {
  let klasa = new TestoviParser(); 
  var x=req.body;
  x=JSON.parse(JSON.stringify(x));
    var tacnost2 = klasa.dajTacnost(JSON.stringify(x));
     let a = req.url.toString();
     let b=a.split('/');
     poslaniIndeks = b[2];
     poslanaGrupa = b[4];
     poslaniIndeks = poslaniIndeks.substring(0);//ukoliko se salje preko postmana =>substring(0)
     poslanaGrupa = poslanaGrupa.substring(0);
     //poslaniIndeks = poslaniIndeks.substring(1);//ukoliko se salje preko metoda potrebno je substring(1)
    // poslanaGrupa = poslanaGrupa.substring(1);
     var imaIndeks=0;
     var imaVjezba=0;
     var zapamti=0;

     Vjezba.findAll().then((rezultat) => {
       for(var i=0;i<rezultat.length;i++){
         if(rezultat[i].dataValues.index == poslaniIndeks && rezultat[i].dataValues.vjezba == poslanaGrupa){
           zapamti = i;
           imaIndeks=1;
           imaVjezba=1;
         }
       }
       if((imaIndeks==0 && imaVjezba==0)|| (imaVjezba==1 && imaIndeks==0) || (imaIndeks==1 && imaVjezba==0)){
        return res.status(404).send("Nije moguće ažurirati vježbe!");
       }
    
       else{
        Vjezba.update({
          tacnost: tacnost2.tacnost,
          greske: JSON.stringify(tacnost2.greske)
      }, { where: {[Op.and]:[{index:poslaniIndeks},{vjezba:poslanaGrupa}]}}).then(result => {
          return res.status(200).send("Vjezbe uspjesno azurirane!");
      }).catch(err => {
        //console.log(err);
       return res.status(404).send("Nije moguće ažurirati vježbe!");
      });
       }
     });
  });
 
app.listen(3000);
            
var par1 = 
{
    
        "stats": {
          "suites": 2,
          "tests": 5,
          "passes": 2,
          "pending": 0,
          "failures": 3,
          "start": "2021-11-05T15:00:26.343Z",
          "end": "2021-11-05T15:00:26.352Z",
          "duration": 9
        },
        "tests": [
          {
            "title": "should draw 3 rows when parameter are 2,3",
            "fullTitle": "Tabela crtaj() should draw 3 rows when parameter are 2,3",
            "file": null,
            "duration": 1,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
          },
          {
            "title": "should draw 2 columns in row 2 when parameter are 2,3",
            "fullTitle": "Tabela crtaj() should draw 2 columns in row 2 when parameter are 2,3",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
          },
          {
            "title": "should draw 1 columns in row 3 when parameter are 1,2",
            "fullTitle": "Tabela crtaj() should draw 1 columns in row 3 when parameter are 1,2",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
          },
          {
            "title": "should draw 1 columns in row 5 when parameter are 1,5",
            "fullTitle": "Tabela crtaj() should draw 1 columns in row 5 when parameter are 1,5",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
          },
          {
            "title": "should draw 9 columns in row 9 when parameter are 9,9",
            "fullTitle": "Tabela crtaj() should draw 9 columns in row 9 when parameter are 9,9",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
          },
        ],
        "pending": [],
        "failures": [
              {
                "title": "should draw 1 columns in row 3 when parameter are 1,2",
                "fullTitle": "Tabela crtaj() should draw 1 columns in row 3 when parameter are 1,2",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
              },
              {
                "title": "should draw 1 columns in row 5 when parameter are 1,5",
                "fullTitle": "Tabela crtaj() should draw 1 columns in row 5 when parameter are 1,5",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
              },
              {
                "title": "should draw 9 columns in row 9 when parameter are 9,9",
                "fullTitle": "Tabela crtaj() should draw 9 columns in row 9 when parameter are 9,9",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
              },
        ],
        "passes": [
          {
              "title": "should draw 2 columns in row 2 when parameter are 2,3",
              "fullTitle": "Tabela crtaj() should draw 2 columns in row 2 when parameter are 2,3",
              "file": null,
              "duration": 0,
              "currentRetry": 0,
              "speed": "fast",
              "err": {}
            },
            {
              "title": "should draw 3 rows when parameter are 2,3",
              "fullTitle": "Tabela crtaj() should draw 3 rows when parameter are 2,3",
              "file": null,
              "duration": 1,
              "currentRetry": 0,
              "speed": "fast",
              "err": {}
            },
        ]
      }
      