var numOfPages = 1;


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
    numOfPages =  pdf.numPages;
    pagination();
 
    // go over every page of the pdf
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const container = document.createElement('div');
      container.id = "container_"+i;
      container.style.position = "relative";
      document.body.appendChild(container);

      // append cnavas of the current page to body
      const pageCanvas = document.createElement('canvas');
      pageCanvas.id = "page_"+i;
      pageCanvas.style.zIndex = 0
      pageCanvas.style.position = "absolute"
      container.appendChild(pageCanvas)
      
      // append transparent edit canva
      const editCanvas = document.createElement('canvas');
      editCanvas.id = "edit_"+i;
      editCanvas.style.zIndex = 1
      editCanvas.style.position = "absolute"
      container.appendChild(editCanvas)

      // append hr to body
      var hr = document.createElement('hr');
      document.body.appendChild(hr);
      // render current page
      pdf.getPage(i).then((page) => {
        renderPage(page, pageCanvas).then(rsult => {
            editCanvas.height = pageCanvas.height;
            editCanvas.width = pageCanvas.width;
        });
      })

      markerResults([1]);
    }
  })
}

function markerResults(results){
  //results should be an array, each obj should have : 
  //1) page number; 2)X&Y Coordinates; 3)width; 4)height;

    const canvas1 = document.getElementById("edit_" + 1);
    const canvasContext1 = canvas1.getContext('2d');
    canvasContext1.globalAlpha = 0.2;   // define opacity
    canvasContext1.fillStyle = "yellow"; // define yellow opacity
    canvasContext1.fillRect(20, 20, 100, 50);
    canvasContext1.fillRect(100, 100, 100, 50);

    canvasContext1.clearRect(20, 20, 100, 50);
  
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
  return page.render(renderContext);
}


function pagination() {
  var offset = $(document).scrollTop(); // get current location of the scroll
  var windowHeight = $(window).height(); // get total window height
  var pageHeight = windowHeight/numOfPages; // get height of a single page base on number of pages and total height
  var currentPage =  parseInt(((offset / pageHeight) + 1), 10); // calc current page 
  var pageNum = document.getElementById("page-title");
    pageNum.innerHTML =  currentPage + "/" + numOfPages; 
   
}


$(document).on('scroll', pagination);



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

