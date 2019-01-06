

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

    renderPDF(url);
  })}

    function renderPDF(url) {
      pdfjsLib.getDocument(url).then((pdf) => {
        for (let i = 1; i <= pdf.numPages; i += 1) {
          const canvas = document.createElement('canvas');
          /* This indentify the canvas as the location of the page */
          canvas.id = i;
          document.body.appendChild(canvas)
          pdf.getPage(i).then((page) => {
            renderPage(page, canvas);
          })
        }
      })
    }





    function renderPage(page, canvas) {
      const viewport = page.getViewport(1.2);
      const canvasContext = canvas.getContext('2d');
      canvasContext.strokeRect(5, 5, 25, 15);
      canvasContext.scale(2, 2);
      canvasContext.strokeRect(5, 5, 25, 15);
      const renderContext = {
        canvasContext,
        viewport
      };
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      page.render(renderContext).then(rsult => {
        download(document.getElementById(canvas.id).toDataURL('image/jpeg'), canvas.id  + "page.gif", "image/jpeg");
        canvasContext.globalAlpha = 0.2;
        canvasContext.fillStyle = "yellow"; 
        canvasContext.fillRect(150, 180, 50, 50); 
        
      })
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
})
  
