function idoSzamol() {
    let utazasInput = document.querySelector('input[name="utazas"]');
    let utazasIdo =  parseInt(utazasInput.value);
    let showIdo = document.querySelector("#feladatIdo");
    showIdo.innerHTML=utazasIdo;
}