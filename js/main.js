/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

function init_main () {
    $('html').hide().fadeIn('slow');
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

$( "#close" ).click(function() {
    window.close();
});

var input = document.getElementById("input-text");
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    $("#input-text").val("kaki")
  }
});

