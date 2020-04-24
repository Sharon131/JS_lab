function handleInterval() {
    var counter_value = document.getElementById("counter").value;
    if(counter_value > 0){
        counter_value-=1;
        for (elem of document.querySelectorAll("span")) {
            elem.textContent = counter_value;
        }
        document.getElementById("counter").value = counter_value;
    }
}

var intervalID = window.setInterval(handleInterval,1000);