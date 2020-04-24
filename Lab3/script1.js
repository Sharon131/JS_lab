function setHandler() {
    var body = document.getElementsByTagName("body")[0];
    console.log(document.getElementsByTagName("body")[0])
    body.classList.add("all_el");
};

function removeHandler() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("all_el");
};