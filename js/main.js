var numOfPages = 1;
var results = [];
var currResultIndex = 0;

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
    numOfPages = pdf.numPages;
    pagination();

    // go over every page of the pdf
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const container = document.createElement('div');
      container.id = "container_" + i;
      container.style.position = "relative";
      container.classList.add("container");
      document.body.appendChild(container);

      // append cnavas of the current page to body
      const pageCanvas = document.createElement('canvas');
      pageCanvas.id = "page_" + i;
      pageCanvas.style.zIndex = 0
      pageCanvas.style.position = "absolute"
      container.appendChild(pageCanvas)

      // append transparent edit canvas
      const editCanvas = document.createElement('canvas');
      editCanvas.id = "edit_" + i;
      editCanvas.style.zIndex = 5
      editCanvas.style.position = "absolute"

      container.appendChild(editCanvas)
      // append hr to body
      var hr = document.createElement('hr');
      document.body.appendChild(hr);
      // render current page
      pdf.getPage(i).then((page) => {
        renderPage(page, pageCanvas).then(rsult => {
          var url = document.getElementById('page_1').toDataURL('image/jpeg')

            $.ajax({
              type: 'GET',
              url: 'http://127.0.0.1:5000/',
              data: 'file=' + url,
              enctype: 'multipart/form-data',
              processData: false,  // Important!
              contentType: 'application/json;charset=UTF-8',
              cache: false,
              success: function(msg){
                  console.log('Done')
              }
          });

        });
      })
    }
  })
}

function markerResults() {
  //results should be an array, each obj should have : 
  //1) page number; 2)X&Y Coordinates; 3)width; 4)height;

  // init current result index to first result
  currResultIndex = 0;

  // show total results number in html
  document.getElementById("totalResultsNumber").innerHTML = results.length;

  // show current results in html
  document.getElementById("currentResult").innerHTML = currResultIndex + 1;

  // go over results
  for (var i = 0; i < results.length; i++) {

    // current result
    let result = results[i];

    // get edit canvas of the result
    const canvas1 = document.getElementById("edit_" + result.pageNumber);
    const canvasContext1 = canvas1.getContext('2d');

    // define opacity
    canvasContext1.globalAlpha = 0.2;

    // define yellow opacity
    canvasContext1.fillStyle = "yellow";

    // marker thr result
    canvasContext1.fillRect(result.coordinates.x, result.coordinates.y, result.width, result.height);
  }
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
  return page.render(renderContext)
}


function pagination() {
  var offset = $(document).scrollTop(); // get current location of the scroll
  var windowHeight = $(window).height(); // get total window height
  var pageHeight = windowHeight / numOfPages; // get height of a single page base on number of pages and total height
  var currentPage = parseInt(((offset / pageHeight) + 1), 10); // calc current page 
  var pageNum = document.getElementById("page-title");
  pageNum.innerHTML = currentPage + "/" + numOfPages;

}



function clearResults() {
  //results should be an array, each obj should have : 
  //1) page number; 2)X&Y Coordinates; 3)width; 4)height;

  // go over all results
  for (var i = 0; i < results.length; i++) {

    // current result
    let result = results[i];
    const canvas1 = document.getElementById("edit_" + result.pageNumber);
    const canvasContext1 = canvas1.getContext('2d');
    canvasContext1.globalAlpha = 0.2;   // define opacity
    canvasContext1.fillStyle = "yellow"; // define yellow opacity
    canvasContext1.clearRect(result.coordinates.x, result.coordinates.y, result.width, result.height);
  }
}

function previusResult() {
  if (currResultIndex > 0) {
    currResultIndex--;
    if (currResultIndex == 0) {
      document.getElementById("nextResultBtn").disabled = true;
    }
    document.getElementById("currentResult").innerHTML = currResultIndex + 1;
    scrollToCurrentResults();
  }
}

function nextResult() {
  if (currResultIndex < results.length - 1) {
    currResultIndex++;
    if (currResultIndex == results.length - 1) {
      document.getElementById("nextResultBtn").disabled = true;
    }
    document.getElementById("currentResult").innerHTML = currResultIndex + 1;
    scrollToCurrentResults();
  }
}

function scrollToCurrentResults() {
  var currResultEditCanvas = document.getElementById("edit_" + results[currResultIndex].pageNumber);
  currResultEditCanvas.scrollIntoView();
}

function onChangeInputText() {
  clearResults();
  results = [{ pageNumber: 2, coordinates: { x: 75, y: 20 }, width: 100, height: 50 },
  { pageNumber: 4, coordinates: { x: 20, y: 100 }, width: 45, height: 20 }]
  markerResults();
  var inputText = document.getElementById("input-text").value;
  if (!inputText || inputText == "") {
    document.getElementById("results-amount-container").style.visibility = "hidden";
  }
  else {
    document.getElementById("results-amount-container").style.visibility = "visible";
  }
  scrollToCurrentResults();

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


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("previusResultBtn").addEventListener("click", previusResult);
  document.getElementById("nextResultBtn").addEventListener("click", nextResult);
  document.getElementById("input-text").addEventListener("input", onChangeInputText);
});


