let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const express = require('express');
const app = express();
chai.should();
var expect = chai.expect;
let server = require('./ruteZaTestove.js');
let db = require('./bazaZaTestove.js');
let ajax = require('./AjaxPozivi.js');
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


//Testovi se ponašaju čudno prilikom prvog pokretanja,tacnije ne izvrse izmjene u bazi
//Iz tog razloga je neophodno pokrenuti file testoviZaBazu.js dva puta kako bi se dodali studenti u bazu
//Prilikom prvog i drugog pokretanja ostaviti samo prvi test aktivan,a ostale testove zakomentarisati
//Nakon toga pokretati testove jedan po jedan
//Na kraju nakon sto su svi testovi pokrenuti moguce je pokrenuti i cijelu skriptu


describe('testiranje POST na /student', function () {
  it('POST /student ce dodati novog studenta jer se ne nalazi u studenti', function (done){
    let student1 = {ime:'Ajla',prezime:'Habib',index:'97',grupa:'GR1'};
    chai.request(app)
      .post('/student')
      .send(ajax.posaljiStudent(student1,call))
      .then(function (res){
        //ukoliko je student dodan treba vratiti status 200 i poruku "Kreiran student!"
           expect(res).to.have.status(200);
      });
      done();
    });
    it('POST /student ce dodati novog studenta jer se ne nalazi u studenti', function (done){
      let student2 = {ime:'Neko',prezime:'Nekic',index:'35',grupa:'GR2'};
      chai.request(app)
        .post('/student')
        .send(ajax.posaljiStudent(student2,call))
        .then(function (res){
           //ukoliko je student dodan treba vratiti status 200 i poruku "Kreiran student!"
             expect(res).to.have.status(200);
        });
        done();
      });
});


describe('testiranje PUT na /student/:index', function () {
  it('PUT /student/:index ce promijeniti grupu studenta sa navedenim indexom ', function (done){
    let indexStudenta=97;
    let grupa = 'GR12345';
    chai.request(app)
      .put('/student/97')
      .send(ajax.postaviGrupu(indexStudenta,grupa,call))
      .then(function (res){
        //ukoliko je grupa promijenjena treba vratiti status 200 i poruku "Promjenjena grupa studentu {97}"
           //expect(res).to.have.status(200);
           res.should.have.status(200);
      });
      done();
    });
  });
    describe('testiranje PUT na /student/:index', function () {
    it('PUT /student/:index nece promijeniti grupu studenta jer navedeni index ne postoji u tabeli student', function (done){
      let indexStudenta=123;
      let grupa='GR1234567';
      chai.request(app)
        .put('/student/123')
        .send(ajax.postaviGrupu(indexStudenta,grupa,call))
            .then(function (res) {
            //ukoliko index ne postoji treba vratiti status 404 i poruku "Student sa indexom {123} ne postoji"
             //  expect(res).to.have.status(404);
             res.should.have.status(404);
               done();
        }).catch(done);       
    });
  });



  describe('testiranje POST na /batch/student', function () {
    it('POST /batch/student ce dodati sve studente jer se nijedan ne nalazi u tabeli studenti', function (done){
       var studenti = "Ime1,Prezime1,1,GR1\nIme2,Prezime2,2,GR2\nIme3,Prezime3,3,GR3";
       chai.request(app)
         .post('/batch/student')
         .set('content-type', 'text/plain')
         .send(ajax.posaljiStudente(studenti,call))
         .then(function (res){
           //ukoliko je student dodan treba vratiti status 200 i poruku "Dodano {3} studenata!"
              expect(res).to.have.status(200);
         });
         done();
       });
     });
     
     //prije pokretanja ovog testa potrebno pokrenuti a zatim zakomentarisati prethodni 
     describe('testiranje POST na /batch/student', function () {
      it('POST /batch/student nece dodati nijednog studenta jer se svi nalaze u tabeli studenti', function (done){
        var studenti = "Ime1,Prezime1,1,GR1\nIme2,Prezime2,2,GR2\nIme3,Prezime3,3,GR3";
        chai.request(app)
          .post('/batch/student')
          .set('content-type', 'text/plain')
          .send(ajax.posaljiStudente(studenti,call))
          .then(function (res){
            //ukoliko je student dodan treba vratiti status 404 i poruku "Dodano {0} studenata,a studenti {1,2,3} već postoje!"
               expect(res).to.have.status(404);
               done();
          }).catch(done);
        });
});

   describe('testiranje POST na /vjezbe', function () {
    it('POST /vjezbe ce dodati za svakog studenta broj vjezbi iz proslijeđenog parametra u tabelu vjezbe', function (done){
      var brojVjezbi = 3;
      chai.request(app)
        .post('/vjezbe')
        .send(ajax.postaviVjezbe(brojVjezbi,call))
        .then(function (res){
          //ukoliko su vjezbe dodane treba vratiti status 200 i poruku "Uspjesno kreirane vjezbe!"
             expect(res).to.have.status(200);
        });
        done();
      });
    });
      describe('testiranje POST na /vjezbe', function () {
      it('POST /vjezbe nece dodati vjezbe jer je poslan negativan parametar', function (done){
        //Kako bi provjerili da li vraca status 404 pretpostavili smo da negativan parametar ne moze biti
        var brojVjezbi = -2;
        chai.request(app)
          .post('/vjezbe')
          .send(ajax.postaviVjezbe(brojVjezbi,call))
              .then(function (res) {
                //ukoliko vjezbe nisu dodane treba vratiti status 404 i poruku "Greska prilikom kreiranja vjezbi!"
                 expect(res).to.have.status(404);
                 done();
          }).catch(done);       
      });
    });

    describe('testiranje POST na /student/:index/vjezba/:vjezba', function () {
        it('POST nece ažurirati liniju u tabeli vjezbe jer index ne postoji', function (done){
          var indexStudenta = 123456789;
          var vjezba=1;
          chai.request(app)
            .post('/student/:index/vjezba/:vjezba')
            .send(ajax.postaviTestReport(indexStudenta,vjezba,par1,call))
                .then(function (res) {
                  //ukoliko vjezbe nisu azurirane treba vratiti status 404 i poruku "Nije moguce azurirati vjezbe!"
                   expect(res).to.have.status(404);
                   done();
            }).catch(done);       
        });
    
        it('POST nece ažurirati liniju u tabeli vjezbe jer vjezba ne postoji', function (done){
          var indexStudenta = 97;
          var vjezba=5;
          chai.request(app)
            .post('/student/:index/vjezba/:vjezba')
            .send(ajax.postaviTestReport(indexStudenta,vjezba,par1,call))
                .then(function (res) {
                  //ukoliko vjezbe nisu azurirane treba vratiti status 404 i poruku "Nije moguce azurirati vjezbe!"
                   expect(res).to.have.status(404);
                   done();
            }).catch(done);       
        });
        it('POST nece ažurirati liniju u tabeli vjezbe jer ni index ni vjezba ne postoje', function (done){
          var indexStudenta = 123456789;
          var vjezba=5;
          chai.request(app)
            .post('/student/:index/vjezba/:vjezba')
            .send(ajax.postaviTestReport(indexStudenta,vjezba,par1,call))
                .then(function (res) {
                  //ukoliko vjezbe nisu azurirane treba vratiti status 404 i poruku "Nije moguce azurirati vjezbe!"
                   expect(res).to.have.status(404);
                   done();
            }).catch(done);       
        });
        
      });
      describe('testiranje POST na /student/:index/vjezba/:vjezba', function () {
        it('POST ce ažurirati liniju u tabeli vjezbe za studenta sa zadanim indexom i za odgovarajuću vježbu', function (done){
          var indexStudenta = 97;
          var vjezba = 3;
          chai.request(app)
            .post('/student/:index/vjezba/:vjezba')
            .send(ajax.postaviTestReport(indexStudenta,vjezba,par1,call))
            .then(function (res){
              //ukoliko su vjezbe azurirane treba vratiti status 200 i poruku "Vjezbe uspjesno azurirane."
                 expect(res).to.have.status(200);
            });
            done();
          });
        });   

describe('testiranje POST na /student', function () {
  it('POST /student nece dodati studenta jer se nalazi u tabeli studenti', function (done){
    let student1 = {ime:'Ajla',prezime:'Habib',index:'97',grupa:'GR1'};
    chai.request(app)
      .post('/student')
      .send(ajax.posaljiStudent(student1,call))
      .then(function (res){
           expect(res).to.have.status(404);
      });
      done();
    });
    it('POST /student ce dodati novog studenta i novu grupu jer se ne nalaze u tabeli studenti i grupa', function (done){
      let student1 = {ime:'Ajla',prezime:'Habib',index:'123456789',grupa:'GRUPA123456789'};
      chai.request(app)
        .post('/student')
        .send(ajax.posaljiStudent(student1,call))
        .then(function (res){
             expect(res).to.have.status(200);
        });
        done();
      });
  });
            
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