
$(".search-button").click(async function searchWeather(event){
    event.preventDefault();
    console.log("Search Weather");
    var apiKey = "c69b59d2c54d81b754f2d4320cd54364";
    // var apiKey = "0017380807320210d8dbd3e12b380410";
    var cityLat = "44.34";
    var cityLon = "10.99";
    var city = "London,uk";
    var apiCall = "http://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&appid="+apiKey;
    apiCall="http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey;
    console.log(apiCall);
    var weatherResponse = await fetch(apiCall);
    var weatherData = await weatherResponse.json();
    console.log(weatherData);
});