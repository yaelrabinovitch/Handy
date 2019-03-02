var numOfPages = 1;
var currResultIndex = 0;

// temporary
var results = []
var msg = '{"text": ["גגגאגגב", "גגג", "גגג", "גגגג", "גגגג", "גג", "בא", "גג", "ג", "ג", "ב", "בגג", "גגג", "בבג", "גגג", "גג", "ג", "גגג", "בג", "בבב", "בג", "גבב", "בג", "גבגג", "גג", "בג", "בג", "בג"], "locations": [[399, 108, 689, 218], [308, 104, 346, 121], [224, 102, 283, 121], [157, 99, 209, 118], [74, 99, 142, 117], [508, 149, 530, 164], [430, 148, 467, 164], [367, 146, 418, 188], [297, 147, 330, 190], [242, 144, 271, 184], [173, 142, 225, 186], [100, 139, 165, 182], [470, 170, 500, 187], [590, 201, 620, 218], [656, 264, 688, 283], [599, 271, 629, 289], [543, 269, 563, 285], [474, 269, 520, 289], [408, 273, 444, 289], [340, 274, 378, 290], [284, 271, 314, 290], [214, 274, 258, 291], [150, 271, 190, 290], [627, 299, 688, 318], [585, 303, 608, 318], [527, 301, 549, 319], [487, 303, 509, 317], [442, 303, 465, 319]]}'
var msgO = JSON.parse(msg);
var text = msgO.text;
var locations = msgO.locations;
var textObj = text.map(function (word, index) { return { word, location: locations[index], pageNum: 1 } });

function localRenderPdf(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function (e) {
    // get binary data as a response
    var blob = this.response;
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
      arrayBuffer = event.target.result;
      var typedarray = new Uint8Array(this.result);
      renderPDF(typedarray);
    };
    fileReader.readAsArrayBuffer(blob);
  };

  xhr.send();
}



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
  if (pdfUrl.startsWith("file:///")) {
    var splitted = pdfUrl.split("file:///");
    localRenderPdf(splitted[1]);
  }
  else {

    renderPDF(pdfUrl);
  }
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
          editCanvas.height = pageCanvas.height;
          editCanvas.width = pageCanvas.width;
          download(document.getElementById(pageCanvas.id).toDataURL('image/png'), pageCanvas.id + ".png", "image/png");
          var url = document.getElementById('page_1').toDataURL('image/png')

          $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:5000/',
            data: 'file=' + pageCanvas.id + ".png",
            enctype: 'multipart/form-data',
            processData: false,  // Important!
            contentType: 'application/json;charset=UTF-8',
            cache: false,
            success: function (msg) {
              console.log('Done')
            },
            error: function (e) {
              console.log(e);
            }
          });

        });
      })
    }
  })
}

function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
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
    const canvas1 = document.getElementById("edit_" + result.pageNum);
    const canvasContext1 = canvas1.getContext('2d');

    // define opacity
    canvasContext1.globalAlpha = 0.2;

    // define yellow opacity
    canvasContext1.fillStyle = "yellow";

    // marker thr result
    let location = calcLocation(result);
    canvasContext1.fillRect(location.x1, location.y1, location.width, location.height);
  }
}

function calcLocation(text) {
  var x1 = text.location[0],
    y1 = text.location[1],
    x2 = text.location[2],
    y2 = text.location[3],
    width = Math.abs(x2 - x1),
    height = Math.abs(y2 - y1);
  return { x1, y1, width, height };
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
    const canvas1 = document.getElementById("edit_" + result.pageNum);
    const canvasContext1 = canvas1.getContext('2d');
    canvasContext1.globalAlpha = 0.2;   // define opacity
    canvasContext1.fillStyle = "yellow"; // define yellow opacity

    let location = calcLocation(result);
    canvasContext1.clearRect(location.x1, location.y1, location.width, location.height);
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
  if (results[currResultIndex]) {
    var currResultEditCanvas = document.getElementById("edit_" + results[currResultIndex].pageNum);
    currResultEditCanvas.scrollIntoView();
  }
}

function onChangeInputText() {
  clearResults();
  var inputText = document.getElementById("input-text").value;

  debugger;
  if (!inputText || inputText === "") {
    document.getElementById("results-amount-container").style.visibility = "hidden";
  }
  else {
    results = textObj.filter(function (wordObj) { return wordObj.word.includes(inputText) });
    markerResults();
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


