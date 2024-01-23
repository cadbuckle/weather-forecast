// Create a weather dashboard with form inputs.
// 1 When page is opened
//      Have Input box for city/town/location
//      Search button to find weather for entered location
//      Large box to right to display current weather (as per "2")
//      5 day forecase for location display under large box
//      "History" (beneath search button) is populated with saved list of searched cities 
//      List is clickable per "5" below
// 2 When a user searches for a city they are 
//      presented with current conditions for that city
//      presented with future conditions for that city
//      city is added to the search history (localstorage)
// 3 When a user views the current weather conditions for that city they are presented with:
//      This is populated in to the "today" section
//      The city name
//      The date
//      An icon representation of weather conditions
//      The temperature
//      The humidity
//      The wind speed
// 4 When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
//      This is populated in to the "forecast" section as cards
//      The date
//      An icon representation of weather conditions
//      The temperature
//      The humidity
// 5 When a user click on a city in the search history they are 
//      presented with current conditions for that city
//      presented with future conditions for that city

// define variables
var searchBtnEl=document.querySelector("#search-button");
var weatherData;
var apiKey = "c69b59d2c54d81b754f2d4320cd54364";

function buildHeader(){
    // Build header
    var todayEl = $("#today");
    todayEl.empty();
    todayEl.append($("<h2>").text("London ("+dayjs().format("DD/MM/YYYY")+")"));

    // add weather image
    var headerEl = $("<p>");

    // add Temp, Wind and Humidty
    // list[0] is now
    headerEl.append($("<img>").attr("src", "https://openweathermap.org/img/wn/"+ weatherData.list[0].weather[0].icon+"@2x.png"));
    headerEl.append($("<div>").text("Temp: "+weatherData.list[0].main.temp));
    headerEl.append($("<div>").text("Wind: "+weatherData.list[0].wind.speed));
    headerEl.append($("<div>").text("Humidity: "+weatherData.list[0].main.humidity+"%"));
    console.log(headerEl);
    todayEl.append(headerEl);
}
function buildForecast(){
    // list[1 to 5] are the next 5 days
    console.log("build 5 day forecast", weatherData);
    console.log(dayjs.unix(1706054400));
    var forecast=weatherData.list;
    for (let i = 1; i <= 5; i++){
        console.log(forecast[i].dt);
        console.log(dayjs.unix(forecast[i].dt));
        //console.log(dayjs.unix(forecast[i].dt));
    }
    
};

// "Search" for entered location on API and return weather
searchBtnEl.addEventListener("click", searchWeather);

// function called from search button
async function searchWeather(event){
    event.preventDefault();

    var cityLat = "44.34";
    var cityLon = "10.99";
    var city = "London,uk";
    var weatherResponse;

    // current forecast for location
    // apiCall="http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey;
    // console.log(apiCall);
    // weatherResponse = await fetch(apiCall);
    // weatherData = await weatherResponse.json();
    // buildHeader();

    // 5 day forecast for location
    apiCall="http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apiKey+"&units=metric";
    weatherResponse = await fetch(apiCall);
    weatherData = await weatherResponse.json();
    console.log(apiCall);
    buildHeader();
    buildForecast();
};