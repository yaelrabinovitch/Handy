
var url = 'http://193.106.55.32:5000/'
function getData(id, dataUrl, pageNumber) {

  $.ajax({
    type: 'POST',
    url: url,
    data: dataUrl,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: 'application/json;charset=UTF-8',
    cache: false,
    success: function (response) {
      var response = JSON.parse(response),
        text = response.text,
        locations = response.locations;

      letters = [];
        for (var key in locations) {
          letters.push({  location: locations[key], pageNum: pageNumber });
        }
      for (var i = 0; i < text.length; i++) {
        if(letters[i])
        letters[i].value = text.charAt(i);
      }


      return { text: text, letters: letters }
    }

    ,
    error: function (e) {
      console.log(e);
      return null;
    }
  });
}