class TestoviParser{
    
TestoviParser(){};
dajTacnost(x){

try{
const obj = JSON.parse(x);

   
var brojTestova = obj['stats']['tests'];
var brojProlaznih = obj['stats']['passes'];
var brojPadajucih = obj['stats']['failures'];
var rezultat = (brojProlaznih/brojTestova)*100;

if(rezultat % 10 == 0){
    rezultat = rezultat;
} 
else{
rezultat = Math.round(rezultat*10)/10;
}
var niz = [];
var str = {"tacnost":"xxx","greske":"x"};
if(rezultat == 100){
var mykey = "tacnost"; 
str[mykey] = rezultat + "%";
var mykey2 = "greske";
str[mykey2] = "[]";
}
else{
var mykey = "tacnost";
str[mykey] = rezultat + "%";
for(var i=0;i<brojPadajucih;i++){
var mykey2 = "greske";
var nova =  obj['failures'][i]['fullTitle'];
niz[i] = nova;
str[mykey2]=niz;
}
}
str = JSON.stringify(str);
return JSON.parse(str);
}
catch(e){
    var nevalidanJSON = {"tacnost":"xxx","greske":"x"};
    var mykey = "tacnost"; 
    nevalidanJSON[mykey] = "0%";
    var mykey2 = "greske";
    nevalidanJSON[mykey2] = "Testovi se ne mogu izvršiti";
    nevalidanJSON = JSON.stringify(nevalidanJSON);
    return JSON.parse(nevalidanJSON);
}
}

porediRezultate(rez1,rez2){

  try{

const obj1 = JSON.parse(rez1);
const obj2 = JSON.parse(rez2);

var brojTestova1 = obj1['stats']['tests'];
var brojProlaznih1 = obj1['stats']['passes'];
var brojPadajucih1 = obj1['stats']['failures'];
var rezultat1 = (brojProlaznih1/brojTestova1)*100;

if(rezultat1 % 10 == 0){
rezultat1 = rezultat1;
} 
else{
rezultat1 = Math.round(rezultat1*10)/10;
}
var brojTestova2 = obj2['stats']['tests'];
var brojProlaznih2 = obj2['stats']['passes'];
var brojPadajucih2 = obj2['stats']['failures'];
var rezultat2 = (brojProlaznih2/brojTestova2)*100;

if(rezultat2 % 10 == 0){
rezultat2 = rezultat2;
} 
else{
rezultat2 = Math.round(rezultat2*10)/10;
}

//Ako je broj testova u oba JSON file-a jednak onda mozemo provjeriti postoji li sansa da su identicni,u suprotnom nisu
if(brojTestova1 == brojTestova2){
var brojac=0;
for(var i = 0;i<brojTestova1;i++){
for(var j=0;j<brojTestova2;j++){
if(obj1['tests'][i]['fullTitle'] === obj2['tests'][j]['fullTitle']){
    brojac++;
}
}
}
if(brojac == brojTestova1){  //Svi fullTitle su jednaki
var niz = [];
var str = {"promjena":"x","greske":"x"};
if(brojPadajucih1 == 0){ //Ukoliko su identicni i tacnost je 100%
    var mykey = "promjena"; 
    str[mykey] = rezultat2 + "%";
    var mykey2 = "greske";
    str[mykey2] = "[]";
    }
    else{
var mykey = "promjena";
str[mykey] = rezultat2 + "%";
//prikazuju se greske iz rezultata 1
for(var i=0;i<brojPadajucih1;i++){
var mykey2 = "greske";
var nova =  obj1['failures'][i]['fullTitle'];
niz[i] = nova;
str[mykey2]=niz;
}
}
}
//ako nisu fullTitle jednaki
else{
var niz = [];
var str = {"promjena":"x","greske":"x"};
var mykey = "promjena";
var brojac1=0;
for(var i=0;i<brojPadajucih1;i++){
    for(var j=0;j<brojTestova2;j++){
        if(obj1['failures'][i]['fullTitle'] == obj2['tests'][j]['fullTitle']){
                brojac1++;
        }
      }
}
var prvi = brojPadajucih1-brojac1; //broj onih koji padaju u rezultatu 1,a ne pojavljuju se u rezultatu 2
var izraz = (prvi + brojPadajucih2)/(prvi + brojTestova2)*100; 
if(izraz % 10 == 0){
    izraz = izraz;
    } 
    else{
    izraz = Math.round(izraz*10)/10;
    }
str[mykey] = izraz + "%";
var izraz2 =prvi + brojPadajucih2;
if(izraz2 != 0 ){
for(var i=0;i<izraz2;i++){
    var mykey2 = "greske";
    var nova =  obj2['failures'][i]['fullTitle'];
    var nova2= obj1['failures'][i]['fullTitle'];
    var len=0;
    niz[len] = nova;
    len++;
    niz[len]=nova2;
    str[mykey2]=niz;
}
}
else{//znaci da nema gresaka
    var mykey2 = "greske";
    str[mykey2]="[]";
}
}
}
else{ //ako je broj testova razlicit u rez1 i rez2
var niz = [];
var str = {"promjena":"x","greske":"x"};
var mykey = "promjena";
var brojac1=0;
var pozicija = [];
var  p= 0;
var temp = [];
var m=0;

for(var i=0;i<brojPadajucih1;i++){
  var istina = 0;
for(var j=0;j<brojTestova2;j++){
    if(obj1['failures'][i]['fullTitle'] == obj2['tests'][j]['fullTitle']){
            brojac1++;
            istina = 1;
    }
} 
if (istina == 0){
  pozicija[m]=obj1['failures'][i]['fullTitle'];
  m++;
}

}

var prvi = brojPadajucih1-brojac1; //broj onih koji padaju u rezultatu 1,a ne pojavljuju se u rezultatu 2
var izraz = (prvi + brojPadajucih2)/(prvi + brojTestova2)*100; 
if(izraz % 10 == 0){
  izraz = izraz;
  } 
  else{
  izraz = Math.round(izraz*10)/10;
  }
str[mykey] = izraz + "%";


var izraz2 =prvi + brojPadajucih2;
if(izraz2 != 0 ){
var mykey2 = "greske";
var len=0;
for(var i=0;i<m;i++){
  if(prvi != 0){
  var nova = pozicija[i];
  niz[len] = nova;
  len++;
  str[mykey2]=niz;
}

else{
for(var j=0;j<brojPadajucih2;j++){
  var nova2 = obj2['failures'][j]['fullTitle'];
  niz[j]=nova2;
  str[mykey2]=niz; 
}
}
}
for(var k=0;k<brojPadajucih2;k++){
var nova2 = obj2['failures'][k]['fullTitle'];
niz[len]=nova2;
len++;
str[mykey2]=niz;
}
}
else{//znaci da nema gresaka
  var mykey2 = "greske";
  str[mykey2]="[]";
}
}
str = JSON.stringify(str);
return JSON.parse(str);

}
catch(e){// ukoliko je neispravan format
  var nevalidanJSON = {"promjena":"xxx","greske":"x"};
  var mykey = "promjena"; 
  nevalidanJSON[mykey] = "0%";
  var mykey2 = "greske";
  nevalidanJSON[mykey2] = "Testovi se ne mogu izvršiti";
  nevalidanJSON = JSON.stringify(nevalidanJSON);
  return JSON.parse(nevalidanJSON);
}
}
};
module.exports = TestoviParser;

//Reporti za provjeru metoda
var x = 
{
    
        "stats": {
          "suites": 2,
          "tests": 4,
          "passes": 3,
          "pending": 0,
          "failures": 1,
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
            "title": "should draw 1 columns in row 1 when parameter are 1,2",
            "fullTitle": "Tabela crtaj() should draw 1 columns in row 1 when parameter are 1,2",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
          },
          {
            "title": "should draw 5 columns in row 5 when parameter are 5,6",
            "fullTitle": "Tabela crtaj() should draw 5 columns in row 5 when parameter are 5,6",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
          },
        ],
        "pending": [],
        "failures": [ {
                "title": "should draw 1 columns in row 1 when parameter are 1,2",
                "fullTitle": "Tabela crtaj() should draw 1 columns in row 1 when parameter are 1,2",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
              }
        ],
        "passes": [
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
                "title": "should draw 5 columns in row 5 when parameter are 5,6",
                "fullTitle": "Tabela crtaj() should draw 5 columns in row 5 when parameter are 5,6",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
              },
             
        ]
      }
      
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
var par2 = 
            {
                
                    "stats": {
                      "suites": 2,
                      "tests": 4,
                      "passes": 1,
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
                        "title": "should draw 2 columns in row 5 when parameter are 1,5",
                        "fullTitle": "Tabela crtaj() should draw 2 columns in row 5 when parameter are 1,5",
                        "file": null,
                        "duration": 0,
                        "currentRetry": 0,
                        "speed": "fast",
                        "err": {}
                      },
                      {
                        "title": "should draw 8 columns in row 9 when parameter are 9,9",
                        "fullTitle": "Tabela crtaj() should draw 8 columns in row 9 when parameter are 9,9",
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
                        "title": "should draw 2 columns in row 2 when parameter are 2,3",
                        "fullTitle": "Tabela crtaj() should draw 2 columns in row 2 when parameter are 2,3",
                        "file": null,
                        "duration": 0,
                        "currentRetry": 0,
                        "speed": "fast",
                        "err": {}
                      },
                      {
                        "title": "should draw 2 columns in row 5 when parameter are 1,5",
                        "fullTitle": "Tabela crtaj() should draw 2 columns in row 5 when parameter are 1,5",
                        "file": null,
                        "duration": 0,
                        "currentRetry": 0,
                        "speed": "fast",
                        "err": {}
                      },
                      {
                        "title": "should draw 8 columns in row 9 when parameter are 9,9",
                        "fullTitle": "Tabela crtaj() should draw 8 columns in row 9 when parameter are 9,9",
                        "file": null,
                        "duration": 0,
                        "currentRetry": 0,
                        "speed": "fast",
                        "err": {}
                      },
                    ],
                    "passes": [
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
    
//var rez = new TestoviParser();
//Tacnost 75% i greska "Tabela crtaj() should draw 1 columns in row 1 when parameter are 1,2"
//console.log(rez.dajTacnost(JSON.stringify(par1)));
//Tacnost 85.7 % i 6 gresaka
//console.log(rez.porediRezultate(JSON.stringify(par1),JSON.stringify(par2)));












