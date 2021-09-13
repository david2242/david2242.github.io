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
    if (gPercekTabla.length) document.querySelector("#adatTorles").removeAttribute("disabled");
}

function tablazatFrissites() {
    document.querySelector("table thead tr").innerHTML="";
    document.querySelector("table tbody").innerHTML="";
    if (document.querySelector("button#kuldes")) {
        document.querySelector("button#kuldes").remove();
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
    child.setAttribute("class", "formPadd btn btn-outline-danger");
    child.setAttribute("id", "kuldes");
    child.setAttribute("onclick", "gPercekTableSend()");
    child.innerHTML="Küldés";
    parent.appendChild(child);
}

function gPercekTableSend() {
    let tablazat = document.querySelector("#gPercekTable");
    Email.send({
        SecureToken : "d86fb17b-6098-4423-af84-b72f7bde5624",
        To : 'nagykatalin.halo@gmail.com',
        From : "plusz.egy.cim@gmail.com",
        Subject : "gondozási percek",
        Body : tablazat.outerHTML
    }).then(
      message => {
          alert(message)
          location.reload();
          return false;
      }
    );
}

function adatokTorlese() {
    location.reload();
    return false;
}