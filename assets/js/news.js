
var state = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
var text= "";
function displayStateInfo(events) {
 events.preventDefault();
  // var state = $(this).attr("state");
  var state = $("#state-input").val().trim();

      // Constructing a queryURL
      var queryURL = "https://gnews.io/api/v3/search?q=coronavirus+" +
        state + "&token=29dc12f0a9f862c5543b034d92de9981";

      // AJAX request with the queryURL
      $.ajax({
        url: queryURL,
        method: "GET"
      })
      // return "$this.state"
        // Data comes back from the request
        .then(function(response) {
          console.log(response);
          console.log(queryURL);
          // storing the data from the AJAX request in the results variable
          var results = response;
          $("#covid-news").empty();
          for (var i = 0; i < response.articles.length; i++) {
            var title =$("<h5>"+response.articles[i].title+"</h5>");
            var description =$("<p> "+response.articles[i].description+"</p>");
            $("#covid-news").append(title);
            $("#covid-news").append(description);
          }
          // var stateDiv = $("<div class='state'>");
    });
 }
//  // Looping through the array of states
//  for ( i = 0; i < state.length; i++) {
// }
// console.log(state);
// This function handles events where a submit button is clicked
//  $("#stateBtn").on("click", function(event) {
//         event.preventDefault();
//         // This line grabs the input from the textbox
//         var state = $("#stateBtn").val().trim();

//         function renderButtons() {

// $("#stateBtn").empty();
//         }
        // Calling renderButtons which handles the processing of our State array
      //   renderButtons();
      // });

      // Adding a click event listener to all elements with a class of "stateBtn"
      $(document).on("click", "#stateBtn", displayStateInfo);