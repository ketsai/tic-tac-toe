function botTurn(serverResponse) {
    if (serverResponse.winner == ' ') {
        $("#winner").html("Tie game");
    } else if (serverResponse.winner != '') {
        $("#winner").html(serverResponse.winner + " wins!");
    } else {
        var randomCell;
        while (gridArray[randomCell] != " ") {
            randomCell = Math.floor(Math.random() * 9);
            //console.log("randomly selected cell: " + randomCell.toString());
        }
        $("#cell" + randomCell.toString()).html("X");
        gridArray[randomCell] = "X";
        $.ajax({
            data: { grid: JSON.stringify(gridArray) },
            url: "/ttt/play",
            method: "POST",
            success: function (response) {
                if (response.winner != '') {
                    $("#winner").html(response.winner + " wins!");
                }
            }
        });
    }
}

$(document).ready(function () {
    $("#cell0").click(function () {
        if (gridArray[0] == " ") {
            gridArray[0] = "O";
            $.ajax({
                data: { move: 0 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell1").click(function () {
        if (gridArray[1] == " ") {
            gridArray[1] = "O";
            $.ajax({
                data: { move: 1 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell2").click(function () {
        if (gridArray[2] == " ") {
            gridArray[2] = "O";
            $.ajax({
                data: { move: 2 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell3").click(function () {
        if (gridArray[3] == " ") {
            gridArray[3] = "O";
            $.ajax({
                data: { move: 3 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell4").click(function () {
        if (gridArray[4] == " ") {
            gridArray[4] = "O";
            $.ajax({
                data: { move: 4 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell5").click(function () {
        if (gridArray[5] == " ") {
            gridArray[5] = "O";
            $.ajax({
                data: { move: 5 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell6").click(function () {
        if (gridArray[6] == " ") {
            gridArray[6] = "O";
            $.ajax({
                data: { move: 6 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell7").click(function () {
        if (gridArray[7] == " ") {
            gridArray[7] = "O";
            $.ajax({
                data: { move: 7 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});

$(document).ready(function () {
    $("#cell8").click(function () {
        if (gridArray[8] == " ") {
            gridArray[8] = "O";
            $.ajax({
                data: { move: 8 },
                url: "/ttt/play",
                method: "POST",
                success: function (response) {
                    drawGrid(response.grid);
                }
            });
        }
    });
});
