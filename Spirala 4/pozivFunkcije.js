function parametri(inputIme,inputPrezime,inputIndex,InputGrupa){
    let student = {
    ime : inputIme,
    prezime : inputPrezime,
    index : inputIndex,
    grupa : InputGrupa
    }
    return student;
}

function pomocnaFunkcija(error,data){
    if(error == null){
    document.getElementById("odgovor1").innerHTML = "Kreiran student!";
    }
    else{
    document.getElementById("odgovor2").innerHTML = "Student sa navedenim indeksom već postoji!";
    }
}