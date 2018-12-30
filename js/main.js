

function loadCurrentPdf() {
  // get all current active tabs
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    var tab = tabs[0]
    var url = tab.url;


    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      './pdf.worker.js';

    // Asynchronous download PDF
    var loadingTask = pdfjsLib.getDocument(url);
  

    loadingTask.promise.then(function (pdf) {
      // write to console number of pages
      console.log("num of pages: " + pdf._pdfInfo.numPages);

      // Fetch the first page
      pdf.getPage(1).then(function (page) {

        // Get viewport of the page at required scale
        var viewport = page.getViewport(2);

        // get canves from html
        var canvas = $('#pdf-canvas').get(0);
        var canvas_context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: canvas_context,
          viewport: viewport,
        };

        // Render the page contents in the canvas
       page.render(renderContext).then(function () {
          // after done render, dowlnload the image
          download(document.getElementById('pdf-canvas').toDataURL('image/jpeg'), "firstPageInPdf.gif", "image/jpeg");
        });
      });
    });
  });
}



function init_main() {
  $('html').hide().fadeIn('slow');
  loadCurrentPdf();
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

$("#close").click(function () {
  window.close();
});

var input = document.getElementById("input-text");
input.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    $("#input-text").val("kaki")
  }
});

