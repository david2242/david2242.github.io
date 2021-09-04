
let gondozottak = [
    {id: 4231, vezNev: "Kiss",          kerNev: "Bácsínyó",     kor: 50,    telepules: "Alap"},
    {id: 5422, vezNev: "Varga",         kerNev: "Despacito",    kor: 77,    telepules: "Alap"},
    {id: 554,  vezNev: "Kovács",        kerNev: "Áron",         kor: 78,    telepules: "Alap"},
    {id: 9243, vezNev: "Semjén",        kerNev: "László",       kor: 68,    telepules: "Alap"},
    {id: 2221, vezNev: "Barabás",       kerNev: "József",       kor: 78,    telepules: "Alap"},
    {id: 6340, vezNev: "Kovács",        kerNev: "Tamás",        kor: 68,    telepules: "Alap"},
    {id: 19,   vezNev: "Horgosi",       kerNev: "Rikárdó",      kor: 55,    telepules: "Alap"},
    {id: 21,   vezNev: "Bubocsnyik",    kerNev: "Endre",        kor: 74,    telepules: "Alap"},
    {id: 104,  vezNev: "Nagy",          kerNev: "Nóémi",        kor: 67,    telepules: "Alsószentiván"},
    {id: 992,  vezNev: "Mckenzie",      kerNev: "Matild",       kor: 68,    telepules: "Alap"},
];

function ujButtonGroup(sorSz) {
    let parentOfButtonGroup = document.querySelector("tbody>tr:nth-last-of-type(1) td:nth-last-of-type(1)");
    let ujButtonGroup = document.createElement("div");
    ujButtonGroup.className = "btn-group";
    parentOfButtonGroup.appendChild(ujButtonGroup);
    let parentOfTwoButtons = document.querySelector("tbody>tr:nth-last-of-type(1) div");
    let szerkesztoGomb = document.createElement("button");
    szerkesztoGomb.className = "btn btn-warning";
    szerkesztoGomb.setAttribute("onclick", "szerkesztes(" + sorSz + ")")
    szerkesztoGomb.innerHTML = '<i class="fas fa-edit"></i>'
    let torlesGomb = document.createElement("button");
    torlesGomb.className = "btn btn-secondary";
    torlesGomb.innerHTML = '<i class="fas fa-trash-alt"></i>';
    parentOfTwoButtons.appendChild(szerkesztoGomb);
    parentOfTwoButtons.appendChild(torlesGomb);

}

function ujCella(parent, content) {
    let parentElement = parent;
    let newTdElement = document.createElement("td");
    newTdElement.innerHTML=content;
    parentElement.appendChild(newTdElement);
}

function tablazatFeltoltes(gondozottak) {
    let trSzulo;
    let tbodyAsParent = document.querySelector("tbody");
    for (let i = 0; i < gondozottak.length; i++ ) {
        tbodyAsParent.appendChild(document.createElement("tr"));
        trSzulo = document.querySelector("tbody tr:nth-last-of-type(1)");
        sorErtekek = Object.values(gondozottak[i]);
        for (let j = 0; j < sorErtekek.length; j++) {
            ujCella(trSzulo, sorErtekek[j]);
        };
        ujCella(trSzulo, "");
        ujButtonGroup(i);
    };
    
};

tablazatFeltoltes(gondozottak);

function szerkesztes(szerkElement) { 
    
    
}

function inputInserter(sorSzam) {
    let szulo = document.querySelector("tbody");
    let gyerek = document.createElement("tr");
    let beillesztesEzele = document.querySelector("tbody tr:nth-child(" + sorSzam + ")");
    szulo.insertBefore(gyerek, beillesztesEzele);

    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ")");
    gyerek = document.createElement("td");
    szulo.appendChild(gyerek);
    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ") td:nth-child(1)");
    gyerek = document.createElement("input");
    gyerek.className = "form-control-sm";
    gyerek.setAttribute("type", "number");
    gyerek.setAttribute("placeholder", "sSz");
    szulo.appendChild(gyerek);

    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ")");
    gyerek = document.createElement("td");
    szulo.appendChild(gyerek);
    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ") td:nth-child(2)");
    gyerek = document.createElement("input");
    gyerek.className = "form-control-sm";
    gyerek.setAttribute("type", "text");
    gyerek.setAttribute("placeholder", "vezetéknév");
    szulo.appendChild(gyerek);

    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ")");
    gyerek = document.createElement("td");
    szulo.appendChild(gyerek);
    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ") td:nth-child(3)");
    gyerek = document.createElement("input");
    gyerek.className = "form-control-sm";
    gyerek.setAttribute("type", "text");
    gyerek.setAttribute("placeholder", "keresztnév");
    szulo.appendChild(gyerek);

    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ")");
    gyerek = document.createElement("td");
    szulo.appendChild(gyerek);
    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ") td:nth-child(4)");
    gyerek = document.createElement("input");
    gyerek.className = "form-control-sm";
    gyerek.setAttribute("type", "number");
    gyerek.setAttribute("placeholder", "életkor");
    szulo.appendChild(gyerek);

    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ")");
    gyerek = document.createElement("td");
    szulo.appendChild(gyerek);
    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ") td:nth-child(5)");
    gyerek = document.createElement("input");
    gyerek.className = "form-control-sm";
    gyerek.setAttribute("type", "text");
    gyerek.setAttribute("placeholder", "település");
    szulo.appendChild(gyerek);

    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ")");
    gyerek = document.createElement("td");
    szulo.appendChild(gyerek);
    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ") td:nth-child(6)");
    let ujButtonGroup = document.createElement("div");
    ujButtonGroup.className = "btn-group";
    szulo.appendChild(ujButtonGroup);
    szulo = document.querySelector("tbody tr:nth-child(" + sorSzam + ") td:nth-child(6) div");
    let elfogadGomb = document.createElement("button");
    elfogadGomb.className = "btn btn-success";
    elfogadGomb.setAttribute("onclick", "felulir(" + sorSzam + ")")
    elfogadGomb.innerHTML = '<i class="far fa-check-square"></i>'
    let megseGomb = document.createElement("button");
    megseGomb.className = "btn btn-danger";
    megseGomb.innerHTML = '<i class="fas fa-undo-alt"></i>';
    szulo.appendChild(elfogadGomb);
    szulo.appendChild(megseGomb);
}

