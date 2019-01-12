
function getTabUrl() {
  // get tab url from url params
  var url_string = window.location.href
  var url = new URL(url_string);
  var url = url.searchParams.get("tabUrl");
  return url;
}


function loadCurrentPdf() {

var pdfUrl = getTabUrl();

  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    './pdf.worker.js';

  renderPDF(pdfUrl);
}

function renderPDF(url) {
// load pdf from url
  pdfjsLib.getDocument(url).then((pdf) => {

    // go over every page of the pdf
    for (let i = 1; i <= pdf.numPages; i += 1) {

      // append title of the page to body
      var pageTitleDiv = document.createElement('div')
      pageTitleDiv.innerHTML = "Page " + i;
      document.body.appendChild(pageTitleDiv)
      pageTitleDiv.classList.add("page-title");

      // append canvas of the current page to body
      const canvas = document.createElement('canvas');
      canvas.id = i;
      document.body.appendChild(canvas)

      // append hr to body
      var hr = document.createElement('hr');
      document.body.appendChild(hr);
      // render current page
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
    // download current page
    download(document.getElementById(canvas.id).toDataURL('image/jpeg'), canvas.id  + "page.gif", "image/jpeg");

    // Draw the marker
    canvasContext.globalAlpha = 0.2;   // define opacity
    canvasContext.fillStyle = "yellow"; // define yellow opacity
    canvasContext.fillRect(150, 180, 50, 50);  // draw the shape - (The x-coordinate , The y-coordinate, The width in px, The height in px)

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

