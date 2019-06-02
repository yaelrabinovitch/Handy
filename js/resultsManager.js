var results = []
var currResultIndex;
 numOfPages


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
  
  function scrollToCurrentResults(currResultIndex) {
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
    scrollToCurrentResults(currResultIndex);
  
  }
  