var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function posaljiStudent(studentObjekat,callback){
   var x = JSON.stringify(studentObjekat);
    x=JSON.parse(x);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
	if (ajax.readyState == 4 && ajax.status == 200){
        callback(null,ajax.responseText);
    }
	if (ajax.readyState == 4 && ajax.status == 404){
       callback(ajax.responseText,null);
    }
		
}
ajax.open("POST", "http://localhost:3000/student", true);
ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
ajax.send("ime=" + x.ime +"&prezime=" + x.prezime +"&index=" + x.index + "&grupa="+x.grupa);
}

function postaviGrupu(indexStudenta,grupa,callback){
     var ajax = new XMLHttpRequest();
 ajax.onreadystatechange = function() {
     if (ajax.readyState == 4 && ajax.status == 200){
         callback(null,ajax.responseText);
     }
    
     if (ajax.readyState == 4 && ajax.status == 404){
         callback(ajax.responseText,null);
     }
         
 }
 ajax.open("PUT", "http://localhost:3000/student/:index" + indexStudenta, true);
 ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 ajax.send("grupa="+ grupa);
 }

 function posaljiStudente(studentiCSVString,callback){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
	if (ajax.readyState == 4 && ajax.status == 200){
        callback(null,ajax.responseText);
    }
	if (ajax.readyState == 4 && ajax.status == 404){
        callback(ajax.responseText,null);
    }	
}
ajax.open("POST", "http://localhost:3000/batch/student", true);
ajax.setRequestHeader("Content-Type", "text/plain");
ajax.send(studentiCSVString);
}


 function postaviVjezbe(brojVjezbi,callback){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
	if (ajax.readyState == 4 && ajax.status == 200){
        callback(null,ajax.responseText);
    }
   
	if (ajax.readyState == 4 && ajax.status == 404){
        callback(ajax.responseText,null);
    }	
}
ajax.open("POST", "http://localhost:3000/vjezbe", true);
ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
ajax.send("brojVjezbi= "+ brojVjezbi);

}

function postaviTestReport(indexStudenta,nazivVjezbe,testReport,callback){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
	if (ajax.readyState == 4 && ajax.status == 200){
        callback(null,ajax.responseText);
    }
   
	if (ajax.readyState == 4 && ajax.status == 404){
        callback(ajax.responseText,null);
    }	
}
ajax.open("POST", "http://localhost:3000/student/:"+indexStudenta+"/vjezba/:"+nazivVjezbe, true);
ajax.setRequestHeader("Content-Type", "application/json");
ajax.send(JSON.stringify(testReport));
}


module.exports={
    posaljiStudent:posaljiStudent,
    postaviGrupu:postaviGrupu,
    posaljiStudente:posaljiStudente,
    postaviVjezbe:postaviVjezbe,
    postaviTestReport:postaviTestReport
  };