var gridArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

$(document).ready(function(){
  $("#cell0").click(function(){
    if(gridArray[0] == " "){
      gridArray[0] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell0").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell1").click(function(){
    if(gridArray[1] == " "){
      gridArray[1] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell1").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell2").click(function(){
    if(gridArray[2] == " "){
      gridArray[2] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell2").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell3").click(function(){
    if(gridArray[3] == " "){
      gridArray[3] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell3").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell4").click(function(){
    if(gridArray[4] == " "){
      gridArray[4] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell4").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell5").click(function(){
    if(gridArray[5] == " "){
      gridArray[5] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell5").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell6").click(function(){
    if(gridArray[6] == " "){
      gridArray[6] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell6").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell7").click(function(){
    if(gridArray[7] == " "){
      gridArray[7] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell7").html("X");
        }
      });
    }
  });
});

$(document).ready(function(){
  $("#cell8").click(function(){
    if(gridArray[8] == " "){
      gridArray[8] = "X";
      $.ajax({
        data:{"grid": gridArray},
        url: "/ttt/play",
        method: "POST",
        success: function(response){
          $("#cell8").html("X");
        }
      });
    }
  });
});
