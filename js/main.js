//GLOBALS
var numOfPages = 1;
var currResultIndex = 0;
var results = []
var textObjects = [];
var isError = false;


//EVENTS
$(document).on('scroll', pagination);

document.addEventListener('DOMContentLoaded', init_main);


//INIT
function init_main() {
  document.getElementById("pdf-container").style.display = "none";
  document.getElementById("error-container").style.display = "none";
  document.getElementById("previusResultBtn").addEventListener("click", previusResult);
  document.getElementById("nextResultBtn").addEventListener("click", nextResult);
  document.getElementById("input-text").addEventListener("input", onChangeInputText);
  document.getElementById("reTryLoadBtn").addEventListener("click", reTryLoad);
  document.getElementById("clear").addEventListener("click", clearInputText);
  $('html').hide().fadeIn('slow');

  loadCurrentPdf();
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
    '../libs/pdf.worker.js';
  if (pdfUrl.startsWith("file:///")) {
    var splitted = pdfUrl.split("file:///");
    localRenderPdf(splitted[1]);
  }
  else {

    renderPDF(pdfUrl);
  }
}

function pagination() {
  var offset = $(document).scrollTop(); // get current location of the scroll
  var windowHeight = $(window).height(); // get total window height
  var pageHeight = windowHeight / numOfPages; // get height of a single page base on number of pages and total height
  var currentPage = parseInt(((offset / pageHeight) + 1), 10); // calc current page 
  var pageNum = document.getElementById("page-title");
  pageNum.innerHTML = currentPage + "/" + numOfPages;
}

function ajax(options) {
  return new Promise(function (resolve, reject) {
    $.ajax(options).done(resolve).fail(reject);
  });
}

//RENDERING
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

function renderPDF(url) {
  var activeAjaxConnections = 0;
  // load pdf from url
  pdfjsLib.getDocument(url).then((pdf) => {
    numOfPages = pdf.numPages;

    // go over every page of the pdf
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const container = document.createElement('div');
      container.id = "container_" + pageNum;
      container.style.position = "relative";
      container.classList.add("container");
      document.getElementById("pdf-container").appendChild(container);

      // append cnavas of the current page to body
      const pageCanvas = document.createElement('canvas');
      pageCanvas.id = "page_" + pageNum;
      pageCanvas.style.zIndex = 0
      pageCanvas.style.position = "absolute"
      container.appendChild(pageCanvas)

      // append transparent edit canvas
      const editCanvas = document.createElement('canvas');
      editCanvas.id = "edit_" + pageNum;
      editCanvas.style.zIndex = 5
      editCanvas.style.position = "absolute"

      container.appendChild(editCanvas)
      // append hr to body
      var hr = document.createElement('hr');
      document.getElementById("pdf-container").appendChild(hr);
      // render current page
      pdf.getPage(pageNum).then((page) => {
        renderPage(page, pageCanvas).then(rsult => {
          editCanvas.height = pageCanvas.height;
          editCanvas.width = pageCanvas.width;
          var dataUrl = document.getElementById('page_' + pageNum).toDataURL('image/png')
          var serverUrl = 'http://193.106.55.32:5000/'
          $.ajax({
            type: 'POST',
            beforeSend: function (xhr) {
              activeAjaxConnections++;
            },
            url: serverUrl,
            data: dataUrl,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: 'application/json;charset=UTF-8',
            cache: false,
            success: function (response) {
              activeAjaxConnections--;
              if (0 == activeAjaxConnections) {
                onFinishGetAllData();
                // this was the last Ajax connection, do the thing
              }

              var response = JSON.parse(response);

              // Get text of current page
              text = response.text;

              // Get locations of letters of current page
              locations = response.locations;

              letters = [];

              // Go over all locations and build letter object
              for (var key in locations) {
                letters.push({ location: locations[key], pageNum: pageNum });
              }

              // Go over all text character and add character value to its letter
              for (var i = 0; i < text.length; i++) {
                if (letters[i]) {
                  letters[i].value = text.charAt(i);
                  letters[i].index = i;
                }
              }

              // Add to text objects the current page letters and text
              textObjects.push({ text: text, letters: letters, pageNum: pageNum });

            },
            error: function (e) {
              isError = true;
              activeAjaxConnections--;
              if (0 == activeAjaxConnections) {
                onFinishGetAllData();
                // this was the last Ajax connection, do the thing
              }
              console.log(e);
              // chrome.tabs.update({ url: chrome.extension.getURL('html/error.html'), selected: true });

            }
          })
        })
      })
    }
  })

}

function onFinishGetAllData() {
  if (!isError) {
    document.getElementById("pdf-container").style.display = "block";
    document.getElementById("loading-container").style.display = "none";
    pagination();
  }
  else {
    document.getElementById("error-container").style.display = "block";
    document.getElementById("pdf-container").style.display = "none";
    document.getElementById("loading-container").style.display = "none";
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

// function _base64ToArrayBuffer(base64) {
//   var binary_string = window.atob(base64);
//   var len = binary_string.length;
//   var bytes = new Uint8Array(len);
//   for (var i = 0; i < len; i++) {
//     bytes[i] = binary_string.charCodeAt(i);
//   }
//   return bytes;
// }


function markerResults() {
  //results should be an array, each obj should have : 
  //1) index; 2)location: x, y, width, height; 3)pageNum; 4)value;

  // init current result index to first result
  currResultIndex = 0;

  // show total results number in html
  document.getElementById("totalResultsNumber").innerHTML = results.length;

  // show current results in html
  document.getElementById("currentResult").innerHTML = currResultIndex + 1;

  if (results.length == 0) {
    document.getElementById("currentResult").innerHTML = currResultIndex;
  }

  // go over results
  for (var i = 0; i < results.length; i++) {

    // current result
    let result = results[i];

    // get edit canvas of the result
    const canvas1 = document.getElementById("edit_" + result[0][0].pageNum);
    const canvasContext1 = canvas1.getContext('2d');

    // define opacity
    canvasContext1.globalAlpha = 0.2;

    // define yellow opacity
    canvasContext1.fillStyle = "yellow";

    // marker thr result
    if (result.length === 1 && result[0].length === 1) {
      canvasContext1.fillRect(result[0][0].location[0], result[0][0].location[1], result[0][0].location[2], result[0][0].location[3]);
    } else {
      result.forEach(row => {
        canvasContext1.fillRect(row[1].location[0], row[1].location[1], parseInt(row[0].location[2]) + parseInt(row[0].location[0]) - parseInt(row[1].location[0]), row[0].location[3]);
      });
    }
  }
}

// function calcLocation(text) {
//   var x1 = text.location[0],
//     y1 = text.location[1],
//     x2 = text.location[2],
//     y2 = text.location[3],
//     width = Math.abs(x2 - x1),
//     height = Math.abs(y2 - y1);
//   return { x1, y1, width, height };
// }

function clearResults() {
  //results should be an array, each obj should have : 
  //1) page number; 2)X&Y Coordinates; 3)width; 4)height;

  // go over all results
  for (var i = 0; i < results.length; i++) {

    // current result
    let result = results[i];
    const canvas1 = document.getElementById("edit_" + result[0][0].pageNum);
    const canvasContext1 = canvas1.getContext('2d');
    canvasContext1.globalAlpha = 0.2;   // define opacity
    canvasContext1.fillStyle = "yellow"; // define yellow opacity


    // clean markers
    if (result.length === 1 && result[0].length === 1) {
      canvasContext1.clearRect(result[0][0].location[0], result[0][0].location[1], result[0][0].location[2], result[0][0].location[3]);
    } else {
      result.forEach(row => {
        canvasContext1.clearRect(row[1].location[0], row[1].location[1], parseInt(row[0].location[2]) + parseInt(row[0].location[0]) - parseInt(row[1].location[0]), row[0].location[3]);
      });
    }
  }
}

function previusResult() {
  if (currResultIndex > 0) {
    currResultIndex--;
    if (currResultIndex == 0) {
      document.getElementById("nextResultBtn").disabled = true;
    }
    document.getElementById("currentResult").innerHTML = currResultIndex + 1;
    scrollToCurrentResults(currResultIndex);
  }
}

function nextResult() {
  if (currResultIndex < results.length - 1) {
    currResultIndex++;
    if (currResultIndex == results.length - 1) {
      document.getElementById("nextResultBtn").disabled = true;
    }
    document.getElementById("currentResult").innerHTML = currResultIndex + 1;
    scrollToCurrentResults(currResultIndex);
  }
}

function scrollToCurrentResults(currResultIndex) {
  if (results.length && results[currResultIndex][0][0]) {
    var currResultEditCanvas = document.getElementById("edit_" + results[currResultIndex][0][0].pageNum);
    currResultEditCanvas.scrollIntoView();
  }
}

function onChangeInputText() {
  clearResults();
  var inputText = document.getElementById("input-text").value;
  if (!inputText || inputText === "") {
    document.getElementById("results-amount-container").style.visibility = "hidden";
  }
  else {
    results = [];
    textObjects.forEach(textObj => {
      var indices = getIndicesOf(inputText, textObj.text);

      textObj.letters.forEach(letter => {
        if (indices.includes(letter.index)) {
          results.push(arrangeResultToRows(letter.index, inputText, textObj));
        }
      });
    });

    markerResults();
    document.getElementById("results-amount-container").style.visibility = "visible";

  }

  scrollToCurrentResults(currResultIndex);
}

function arrangeResultToRows(index, inputText, textObj) {
  if (inputText.length === 1) {
    return [[textObj.letters[index]]];
  } else {
    let arr = [];
    let charsArr = [...inputText];
    let rows = {}

    for (let i = index; i < charsArr.length + index; i++) {
      const y = parseInt(textObj.letters[i].location[1]);
      if (y > 0) {
        if (!rows[y]) rows[y] = []
        rows[y].push(i);
      }
    }

    Object.keys(rows).forEach(y => {
      let first = rows[y][0],
        last = rows[y][rows[y].length - 1];
      arr.push([textObj.letters[first], textObj.letters[last]]);
    });
    return arr;
  }
}


function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0, index, indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

function reTryLoad() {
  window.location.reload()
}

function clearInputText() {
  document.getElementById("input-text").value = "";
  onChangeInputText();
}






