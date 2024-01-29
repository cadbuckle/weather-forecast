// define constants
const apiKey = "c69b59d2c54d81b754f2d4320cd54364";
const iconExt = ".png"; // 1x icon size
// const iconExt = "@2x.png";  // 2x icon size
const degree = "°C";

// define element variables
var searchBtnEl = document.querySelector("#search-button");
var searchTextEl = document.querySelector("#search-input");

// define variables
var weatherData;
var currentDate;
var cityEntered;
var apiCall;
var historyArray = [];
var lcHistoryArray = [];

function buildHeader() {
  // Build header
  cityEntered = weatherData.city.name;
  var weatherNow = weatherData.list[0];
  var todayEl = $("#today");
  todayEl.empty();
  todayEl.attr("class", "row mt-3 bigcard card");

  // div, p, img to display the Current Weather
  var divEl = $("<div>");
  divEl.addClass("currentWeather");
  var pEl = $("<p>");
  pEl = cityEntered + " (" + dayjs().format("DD/MM/YYYY") + ") ";
  var imgEl = $("<img>");
  imgEl.attr(
    "src",
    "https://openweathermap.org/img/wn/" + weatherNow.weather[0].icon + iconExt
  );

  divEl.append(pEl);
  divEl.append(imgEl);
  todayEl.append(divEl);

  // add weather image
  var headerEl = $("<p>");

  // add Temp, Wind and Humidty
  // list[0] is now!
  headerEl.append($("<div>").text("Temp: " + weatherNow.main.temp + degree));
  headerEl.append($("<div>").text("Wind: " + weatherNow.wind.speed + "m/s"));
  headerEl.append(
    $("<div>").text("Humidity: " + weatherNow.main.humidity + "%")
  );
  todayEl.append(headerEl);
  currentDate = dayjs.unix(weatherNow.dt).format("DD/MM/YYYY");
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
  const newCardTemp = document.createElement("p");
  newCardTemp.textContent = "Temp: " + cardTemp + degree;
  newCardBody.appendChild(newCardTemp);

  // define card wind
  const newCardWind = document.createElement("p");
  newCardWind.textContent = "Wind: " + cardWind + "m/s";
  newCardBody.appendChild(newCardWind);

  // define card humidity
  const newCardHumid = document.createElement("p");
  newCardHumid.textContent = "Humidity: " + cardHumdity + "%";
  newCardBody.appendChild(newCardHumid);
  newCard.appendChild(newCardBody);
  return newCardBody;
}

async function searchWeather(event) {
  event.preventDefault();

  // get entered city
  cityEntered = searchTextEl.value.trim();
  searchTextEl.value = "";

  if (!cityEntered) {
    alert("Please enter a location for the forecast");
  } else {
    var weatherResponse;

    buildAPI();
    weatherResponse = await fetch(apiCall);
    if (weatherResponse.status != 200) {
      alert("Location '"+cityEntered+"' cannot be found!");
    } else {
      weatherData = await weatherResponse.json();

      buildHeader();
      buildForecast();
      saveToHistory();
    }
  }
}

function buildAPI() {
  apiCall =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityEntered +
    "&appid=" +
    apiKey +
    "&units=metric";
}

function saveToHistory() {
  var lcCity = cityEntered.toLowerCase();
  // if city not in array then add to array and redisplay the history
  if (!lcHistoryArray.includes(lcCity)) {
    // only retain 6 items in history

    var lcHistArr5 = [];
    lcHistArr5.push(lcCity);
    var histArr5 = [];
    histArr5.push(cityEntered);
    var hArr = histArr5.concat(historyArray.slice(0, 5));
    historyArray = hArr;
    // save list to local storage
    localStorage.setItem("wk08-weather-history", JSON.stringify(hArr));

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
  lcHistoryArray = [];
  // only process is history array not empty
  if (historyArray !== null) {
    // create lowercase version of HistoryArray
    for (let i = 0; i < historyArray.length; i++) {
      lcHistoryArray.push(historyArray[i].toLowerCase());
    }
    displayHistory();
  } else {
    historyArray = [];
  }
}

// "Search" for entered location on API and return weather
searchBtnEl.addEventListener("click", searchWeather);

// add click listener for all saved locations
$(document).on("click", ".history-button", displayHistoryItem);

// function to display the weather for an item from the history list
async function displayHistoryItem() {
  cityEntered = $(this).attr("data-name");
  buildAPI();
  weatherResponse = await fetch(apiCall);
  weatherData = await weatherResponse.json();

  buildHeader();
  buildForecast();
}

loadFromHistory();
