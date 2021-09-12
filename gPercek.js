let gPercekKeys = ["név", "dátum", "érkezés", "távozás", "utazás"]

let gPercekTabla = [];

function gondozasRekordBeolvasas() {    //1. resz beolvasas
    let kepernyoAdatok = document.querySelectorAll("input")
    gPercekTabla.push({
        gondozottNev: kepernyoAdatok[0].value,
        datum: kepernyoAdatok[1].value,
        erkezes: kepernyoAdatok[2].value,
        tavozas: kepernyoAdatok[3].value,
        utazas: kepernyoAdatok[4].value
        })
    
    tablazatFrissites(gPercekTabla);    
}

function tablazatFrissites() {
    document.querySelector("table thead tr").innerHTML="";
    document.querySelector("table tbody").innerHTML="";
    if (document.querySelector("div.col button:nth-child(4)")) {
        document.querySelector("div.col button:nth-child(4)").remove();
    }
    tablaFejlec();
    tablaTartalom();
    kuldesButtonCreator()
}

function tablaFejlec() {
    let parent = document.querySelector("table thead tr");
    let child;
    for (let i = 0; i<gPercekKeys.length; i++) {
        child = document.createElement("th");
        child.innerHTML=gPercekKeys[i];
        parent.appendChild(child);
    }
}

function tablaTartalom() {
    for (let r = 0; r < gPercekTabla.length; r++) {
        parent = document.querySelector("table tbody");
        child = document.createElement("tr");
        parent.appendChild(child);
        let sorErtekek = Object.values(gPercekTabla[r])
        for (let i = 0; i<gPercekKeys.length; i++) {
            child = document.createElement("td");
            child.innerHTML=sorErtekek[i];
            parent.appendChild(child);
        }
    }
}

function kuldesButtonCreator() {
    let parent = document.querySelector("div.col");
    let child = document.createElement("button");
    child.setAttribute("class", "formPadd btn btn-primary");
    child.setAttribute("onclick", "gPercekTableSend()");
    child.innerHTML="Küldés";
    parent.appendChild(child);
}

Email.send({
    Host : "smtp.elasticemail.com",
    Username : "plusz.egy.cim@gmail.com",
    Password : "1F17E6B09377C17EE599ED985750C9A76D68",
    To : 'plusz.egy.cim@gmail.com',
    From : "plusz.egy.cim@gmail.com",
    Subject : "This is the subject",
    Body : "And this is the body"
}).then(
  message => alert(message)
);