var text = window.prompt("Tekst1","Tekst2");
//console.log(typeof text);
console.log(text);

var button = document.getElementById('button');;

function firstEventHandler () {
    var text_field = document.forms[0].elements[0].value
    alert("Naciśnięto przycisk. Wartość:" + text_field);
};

button.addEventListener('click', firstEventHandler, false);
