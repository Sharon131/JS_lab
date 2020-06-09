
var finished = false;

function checkWinning() {
    
    for (i=0;i<3;i++) {
        if ($("#" + (3*i)).text() == $("#" + (3*i+1)).text() && $("#" + (3*i)).text() == $("#" + (3*i+2)).text() && $("#" + (3*i)).text()!='-') {
            return $("#" + (3*i)).text();
        }
        if ($("#" + (i)).text() == $("#" + (3+i)).text() && $("#" + (i)).text() == $("#" + (6+i)).text() && $("#" + (i)).text()!='-') {
            return $("#" + (i)).text();
        }
    }

    if ($("#0").text() == $("#4").text() && $("#0").text() == $("#8").text() && $("#0").text() != '-') {
        return $("#0").text();
    }

    if ($("#6").text() == $("#4").text() && $("#6").text() == $("#2").text() && $("#6").text() != '-') {
        return $("#6").text();
    }

    return '-';
}

function newGame(won) {
    
    if (won) {
        $("p").html("You won.");
        const val = parseInt($("#player").text());
        $("#player").html((val+1).toString());
    } else {
        $("p").html("You lost.");
        const val = parseInt($("#js").text());
        $("#js").html((val+1).toString());
    }

    for (i=0;i<9;i++) {
        $("#"+i).html('-');
    }

    setTimeout(() => {
        $("p").html("");
    }, 2000);
}

function tdOnClick(id) {
        
    if ($(id).text() != "O" && $(id).text()!= 'X') {
        $(id).html("O");

        const win = checkWinning();

        if (win == 'X' || win == 'O') {
            newGame(win == 'O');
        } else {
            
            var next_move = Math.floor(Math.random()*9);
            var next_id = "#" + next_move;

            while ($(next_id).text() == "X" || $(next_id).text() == 'O') {
                var next_move = Math.floor(Math.random()*9);
                var next_id = "#" + next_move;
            }

            $(next_id).html('X');

            const win2 = checkWinning();

            if (win2 == 'X' || win2 == 'O') {
                newGame(win2 == 'O');
            }
            
        }
    }

}


$(document).ready( () => {
    alert("The current document is ready for processing");
    
   $("#0").click( () => {
       tdOnClick("#0");
   });
   $("#1").click(() => {
        tdOnClick("#1");
    });
   $("#2").click(() => {
        tdOnClick("#2");
    });
   $("#3").click(() => {
        tdOnClick("#3");
    });
   $("#4").click(() => {
        tdOnClick("#4");
    });
   $("#5").click(() => {
        tdOnClick("#5");
    });
   $("#6").click(() => {
        tdOnClick("#6");
    });
   $("#7").click(() => {
        tdOnClick("#7");
    });
   $("#8").click(() => {
        tdOnClick("#8");
    });
    
});
