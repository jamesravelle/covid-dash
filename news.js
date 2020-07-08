
var state = $(this).attr("stateName");

// Constructing a queryURL
var queryURL = "https://gnews.io/api/v3/search?q=coronavirus" +
  state + "&token=29dc12f0a9f862c5543b034d92de9981";

// AJAX request with the queryURL
$.ajax({
  url: queryURL,
  method: "GET"
})
  // Data comes back from the request
  .then(function(response) {
    console.log(response);
    console.log(queryURL);
    // storing the data from the AJAX request in the results variable
    var results = response;
