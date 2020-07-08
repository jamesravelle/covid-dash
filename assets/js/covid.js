// Get Covid Numbers by state
// Set global variables
var result = "";
var stateAbbr = "";
var stateName = "";
// Default date format YYYYMMDD ex. 20200612. Set default date to yesterday
var date = outputDate(-1);
// Format outputted date
printDate(date);

function getCovidStatsClick(state, date){
  if(state === "" || state === "USA"){
    state = "USA";
    var query = "https://covidtracking.com/api/v1/us/" + date + ".json";
  } else {
    var query = "https://covidtracking.com/api/v1/states/" + state.toLocaleLowerCase() + "/" + date + ".json";
    zoomMap(state);
  } 
    console.log(query);
      $.ajax({ // Added return statement here
          url: query,
          method:"GET",
          error:function (xhr, ajaxOptions, thrownError){
              if(xhr.status==404) {
                  alertError();
                  return;
              }
          }
      }).then(function(response){
          console.log(response);
          outputClickedStats(state, response.positive, response.negative, response.hospitalizedCurrently, response.death);
          printDate(date.toString());
          printLocation(state);
      })
}

/*
Build Graph/Table
*/
function getCovidStatsDate(state, date){
    var query = "https://covidtracking.com/api/v1/states/" + state.toLocaleLowerCase() + "/" + date + ".json";
    console.log(query);
      $.ajax({ // Added return statement here
          url: query,
          method:"GET",
          error:function (xhr, ajaxOptions, thrownError){
              if(xhr.status==404) {
                  alertError();
                  return;
              }
          }
      }).then(function(response){
        var newDiv = $('<div>');
        newDiv.text(formatDate(date) + ": " + response.positiveIncrease);
        $("#graph").append(newDiv);  
      })
}

function buildGraph(state, date){
  console.log("Date: " + date);
  var month = date[6] + "" + date[7];
  var day = date[4] + "" + date[5];
  var year = date[0] + "" + date[1] + "" + date[2] + "" + date[3];
  for (var i = 0; i < 8; i++){
    console.log("Date: " + outputDateGraph(-i, year, month, day));
    getCovidStatsDate(state, outputDateGraph(-i, parseInt(year), parseInt(month), parseInt(day)))
  }
}

function outputDateGraph(numDays, year, month, day){
  // Function to retrieve date +/- amount of days
  var targetDate = new Date(year, month, day);
  console.log(targetDate);
  console.log(year);
  console.log(month);
  console.log(day);
  targetDate.setDate(targetDate.getDate() + numDays);
  var year = targetDate.getFullYear();
  var month = targetDate.getMonth();
  var day = targetDate.getDate();
  // Check if month/day are single digit. If they are add a 0 before it (06, 01, etc.)
  if(month.toString().length < 2){
      month = "0" + month;
  }
  if(day.toString().length < 2){
      day = "0" + day;
  }
  return year + "" + month + "" + day;
}


function alertError(){
    
}

function outputClickedStats(state, pos,neg,hosp,deaths){
    $('#total-header').text("Total for " + state + " as of " + formatDate(date));
    $('#positive').text(pos)
    $('#negative').text(neg)
    $('#hospitalized').text(hosp)
    $('#deaths').text(deaths)
}

function zoomMap(x){
    var stateString = "US-" + x.toUpperCase();
    chart.zoomToMapObject(polygonSeries.getPolygonById(stateString));
}

$('#submit').on("click", function(e){
    e.preventDefault();
    var location = $('#location').val();
    date = $('#date').val();
    getCovidStatsClick(location, parseInt(date));
    buildGraph(location, date)
    stateArray = [];
    positiveArray = [];
    colorArray = [];
    hospitalizedArray = [];
})

/*

MAPS CODE

*/

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_usaLow;

// Set projection
chart.projection = new am4maps.projections.AlbersUsa();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;

// Add data tool tip and fill
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.fill = am4core.color("#E8BE89");


// Click event
polygonTemplate.events.on("hit", function(ev) {
    ev.target.series.chart.zoomToMapObject(ev.target);
    var stateAbbr = ev.target.dataItem.dataContext.id.split("-").pop();
    console.log(stateAbbr);
    // get object info
    getCovidStatsClick(stateAbbr, date);
});

// Hover event
/*
polygonTemplate.events.on("over", function(ev) {
    polygonTemplate.fill = "";
    stateAbbr = ev.target.dataItem.dataContext.id.split("-").pop();
    getCovidStatsHover(stateAbbr,date);
});
*/

// Reset zoom button
let home = chart.chartContainer.createChild(am4core.Button);
home.label.text = "Reset Zoom";
home.align = "right";
home.events.on("hit", function(ev) {
  chart.goHome();
});


/*

Geo Location

*/
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    var geoAPI = "cedbd416f0e54e32a4d7eadfd8b2e680";
    var locationQuery = "https://api.opencagedata.com/geocode/v1/json?q=" + position.coords.latitude + "+" + position.coords.longitude + "&key=" + geoAPI; 
    callLocationAPI(locationQuery);
  }

  function printLocation(x){
    $('#output-location').text(x.toUpperCase());
  }

  function printDate(date){
    $('#output-date').text(formatDate(date));
  }

  function formatDate(date){
    // Change date form YYYYMMDD -> MM/DD/YYYY
    return date[4] + date[5] + "/" + date[6] + date[7] + "/" + date[0] + date[1] + date[2] + date[3];
  }
  
  function callLocationAPI(x){
    $.ajax({
        url:x,
        method:"GET"
    }).then(function(response){
      // Convert longitude/latitude into city state
      console.log(response);
       getCovidStatsClick(response.results[0].components.state_code, date)
    })
  }
  
  $('#current-location').on("click", function(){
    getLocation();
  })

function outputDate(numDays){
    // Function to retrieve date +/- amount of days
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + numDays);
    var year = targetDate.getFullYear();
    var month = targetDate.getMonth() + 1;
    var day = targetDate.getDate();
    // Check if month/day are single digit. If they are add a 0 before it (06, 01, etc.)
    if(month.toString().length < 2){
        month = "0" + month;
    }
    if(day.toString().length < 2){
        day = "0" + day;
    }
    return year + "" + month + "" + day;
}



/*

Heat map

*/
var stateArray = [];
var positiveArray = [];
var colorArray = [];
var hospitalizedArray = [];

var labelSeries = chart.series.push(new am4maps.MapImageSeries());
var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
labelTemplate.horizontalCenter = "middle";
labelTemplate.verticalCenter = "middle";
labelTemplate.fontSize = 10;
labelTemplate.nonScaling = true;
labelTemplate.interactionsEnabled = false;

polygonSeries.events.on("inited", function () {
  polygonSeries.mapPolygons.each(function (polygon) {
    // Fill
    let state = polygon.dataItem.dataContext.id.split("-").pop();
    getCovidStatsMap(state,date);
  });
});

function getCovidStatsMap(x, y){
    var state = x;
    // date format: 20200501
    var date = y;
    var query = "https://covidtracking.com/api/v1/states/" + state.toLocaleLowerCase() + "/" + date + ".json";
    $.ajax({ // Added return statement here
        url:query,
        method:"GET",
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status==404) {
                alertError();
                return;
            }
        }
    }).then(function(response){
        buildHeatMap(response.state, response.positiveIncrease, response.hospitalizedCurrently);
    })
}

function buildHeatMap(state, pos, hosp){
    stateArray.push(state);
    positiveArray.push(pos);
    hospitalizedArray.push(hosp);
    if(stateArray.length === 51){
        var max = Math.max.apply(null, positiveArray);
        var min = Math.min.apply(null, positiveArray);
        console.log(max + "/" + min);
        for(var i = 0; i < stateArray.length; i++){
          var percentValue = parseInt((positiveArray[i] / (max - min)) * 100);
          console.log(stateArray[i] + "/" + positiveArray[i] + ": " + percentValue);
          if(positiveArray[i] === 0 || positiveArray[i] < 0){
            // 0 or not defined
            colorArray.push('#B8B8B8');
          } else if(positiveArray[i] >= 0 && positiveArray[i] <= 100){
            // 0 - 100
            colorArray.push('#f9ff00');
          } else if(positiveArray[i] >= 100 && positiveArray[i] <= 200){
            // 100 - 200
            colorArray.push('#f9f400');
          } else if(positiveArray[i] >= 200 && positiveArray[i] <= 300){
            // 200 - 300
            colorArray.push('#f9eb00');
          } else if(positiveArray[i] >= 300 && positiveArray[i] <= 400){
            // 300 - 400
            colorArray.push('#f9d900');
          } else if(positiveArray[i] >= 400 && positiveArray[i] <= 500){
            // 400 - 500
            colorArray.push('#f9c700');
          } else if(positiveArray[i] >= 500 && positiveArray[i] <= 1000){
            // 500 - 1000
            colorArray.push('#f9b800');
          } else if(positiveArray[i] >= 1000 && positiveArray[i] <= 1500){
            // 1000 - 1500
            colorArray.push('#faa600');
          } else if(positiveArray[i] >= 1500 && positiveArray[i] <= 2000){
            // 1500 - 2000
            colorArray.push('#fa9700');
          } else if(positiveArray[i] >= 2000 && positiveArray[i] <= 5000){
            // 2000 - 5000
            colorArray.push('#fb7d00');
          } else if(positiveArray[i] >= 5000 && positiveArray[i] <= 10000){
            // 5000 - 10,000
            colorArray.push('#fc6300');
          } else {
            // Greater than 10,000
            colorArray.push('#ff0000');
          }
        }
    }
}

function getColorCode(state){
    stateArray.indexOf(state);
    return colorArray[stateArray.indexOf(state)];
}

function getPositiveCases(state){
    stateArray.indexOf(state);
    var posArray = positiveArray[stateArray.indexOf(state)];
    if(posArray){
      return positiveArray[stateArray.indexOf(state)];
    }
    else {
      return "N/A";
    }
}

function getHospitalized(state){
    stateArray.indexOf(state);
    var hospArray = hospitalizedArray[stateArray.indexOf(state)];
    if(hospArray){
      return hospitalizedArray[stateArray.indexOf(state)];
    }
    else {
      return "N/A";
    }
}

polygonSeries.events.on("inited", function () {
    setInterval(function(){ 
        polygonSeries.mapPolygons.each(function (polygon) {
            // Fill
            let state = polygon.dataItem.dataContext.id.split("-").pop();
            getCovidStatsMap(state,date);
            polygon.fill = getColorCode(state);
        });
        polygonSeries.mapPolygons.each(function (polygon) {
          let label = labelSeries.mapImages.create();
          let state = polygon.dataItem.dataContext.id.split("-").pop();
          label.latitude = polygon.visualLatitude;
          label.longitude = polygon.visualLongitude;
          label.children.getIndex(0).text = state
          // polygon.tooltipText = state + ": " + getPositiveCases(state) + "/" + getHospitalized(state);
          polygon.tooltipText = `[bold]{name}: ` + formatDate(date) + `[/]
          ----
          New Cases: ` + getPositiveCases(state) + `[/]
          Hospitalized: ` + getHospitalized(state)
        });
    }, 1000);
});