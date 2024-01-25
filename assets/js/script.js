// Create a weather dashboard with form inputs.
// 1 When page is opened
//      Have Input box for city/town/location
//      Search button to find weather for entered location
//      "History" (beneath search button) is populated with saved list of searched cities
//      List is clickable per "5" below
// 2 When a user searches for a city they are
//      city is added to the search history (localstorage)
// 5 When a user click on a city in the search history they are
//      presented with current conditions for that city
//      presented with future conditions for that city

// define constants
const apiKey = "c69b59d2c54d81b754f2d4320cd54364";
const iconExt = ".png"; // 1x icon size
// const iconExt = "@2x.png";  // 2x icon size

// define element variables
var searchBtnEl = document.querySelector("#search-button");
var searchTextEl = document.querySelector("#search-input");

// define variables
var weatherData;
var currentDate;
var historyArray = [];
var lcHistoryArray = [];

function buildHeader() {
  // Build header
  cityEntered = weatherData.city.name;
  var todayEl = $("#today");
  todayEl.empty();
  todayEl.attr("class", "row mt-3 bigcard card");
  todayEl.append(
    $("<h2>").text(cityEntered + " (" + dayjs().format("DD/MM/YYYY") + ")")
  );

  // add weather image
  var headerEl = $("<p>");

  // add Temp, Wind and Humidty
  // list[0] is now!
  headerEl.append(
    $("<img>").attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        weatherData.list[0].weather[0].icon +
        iconExt
    )
  );
  headerEl.append($("<div>").text("Temp: " + weatherData.list[0].main.temp));
  headerEl.append($("<div>").text("Wind: " + weatherData.list[0].wind.speed));
  headerEl.append(
    $("<div>").text("Humidity: " + weatherData.list[0].main.humidity + "%")
  );
  todayEl.append(headerEl);
  currentDate = dayjs.unix(weatherData.list[0].dt).format("DD/MM/YYYY");
}
function buildForecast() {
  var forecastData = weatherData.list;

  var forecastEl = $("#forecast");
  forecastEl.empty();
  forecastEl.append($("<h3>").text("5-Day Forecast:"));

  // count for number of days
  var day = 0;

  // iterate through data and build new card on change of date
  for (let i = 1; i < weatherData.cnt; i++) {
    if (currentDate != dayjs.unix(forecastData[i].dt).format("DD/MM/YYYY")) {
      day++;
      currentDate = dayjs.unix(forecastData[i].dt).format("DD/MM/YYYY");
      var nc = newForecastCard(
        currentDate,
        forecastData[i].main.temp,
        forecastData[i].wind.speed,
        forecastData[i].main.humidity,
        forecastData[i].weather[0].icon
      );
      forecastEl.append(nc);
      if (day > 5) {
        break;
      }
    }
  }
}

function newForecastCard(cardDate, cardTemp, cardWind, cardHumdity, cardIcon) {
  // define card
  const newCard = document.createElement("div");
  newCard.classList.add("col-2");
  newCard.classList.add("card");

  // define card body
  const newCardBody = document.createElement("div");
  newCardBody.classList.add("col-2");
  newCardBody.classList.add("card");
  // newCardBody.classList.add('card-body');

  // define card title
  const newCardTitle = document.createElement("h5");
  newCardTitle.classList.add("card-title");
  newCardTitle.textContent = cardDate;
  newCardBody.appendChild(newCardTitle);

  // define weather image
  const newCardImg = document.createElement("img");
  newCardImg.src = "https://openweathermap.org/img/wn/" + cardIcon + iconExt;
  newCardBody.appendChild(newCardImg);

  // define card temp
  const newCardTemp = document.createElement("ul");
  newCardTemp.textContent = "Temp: " + cardTemp;
  newCardBody.appendChild(newCardTemp);

  // define card wind
  const newCardWind = document.createElement("ul");
  newCardWind.textContent = "Wind: " + cardWind;
  newCardBody.appendChild(newCardWind);

  // define card humidity
  const newCardHumid = document.createElement("ul");
  newCardHumid.textContent = "Humidity: " + cardHumdity;
  newCardBody.appendChild(newCardHumid);
  newCard.appendChild(newCardBody);
  return newCardBody;
  // return newCard;
}

// "Search" for entered location on API and return weather
searchBtnEl.addEventListener("click", searchWeather);

async function searchWeather(event) {
  event.preventDefault();

  // get entered city
  var cityLat = "51.5072";
  var cityLon = "0.1276";
  var cityEntered = searchTextEl.value;

  if (!cityEntered) {
    alert("Please enter a location for the forecast");
  } else {
    var weatherResponse;

    // 5 day forecast for location
    apiCall =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      cityEntered +
      "&appid=" +
      apiKey +
      "&units=metric";
    weatherResponse = await fetch(apiCall);
    weatherData = await weatherResponse.json();

    buildHeader();
    buildForecast();
    saveToHistory();
  }
}

function saveToHistory() {
  console.log("Save");
  var lcCity = cityEntered.toLowerCase();
  // if city not in array then add to array and redisplay the history
  if (!lcHistoryArray.includes(lcCity)) {
    lcHistoryArray.push(lcCity);
    historyArray.push(cityEntered);
    // save list to local storage
    localStorage.setItem("wk08-weather-history", JSON.stringify(historyArray));
    // redraw history list
    displayHistory();
  }
}

function displayHistory() {
  // empty on-screen list
  // iterate through history array and build item for display
  $("#history").empty();
  for (let i = 0; i < historyArray.length; i++) {
    const arrayItem = historyArray[i];
    // define button
    var a = $("<button>");
    // assign data-name as the location
    a.attr("data-name", historyArray[i]);
    // assign style to button
    a.addClass("btn history-button border-curve");
    // add button text
    a.text(historyArray[i]);
    // add button to list
    $("#history").append(a);
  }
}

function loadFromHistory() {
  // get History from local storage
  historyArray = JSON.parse(localStorage.getItem("wk08-weather-history"));
  // only process is history array not empty
  if (historyArray !== null) {
    // create lowercase version of HistoryArray
    lcHistoryArray = [];
    for (let i = 0; i < historyArray.length; i++) {
      lcHistoryArray.push(historyArray[i].toLowerCase());
    }
    displayHistory();
}
}

loadFromHistory();
