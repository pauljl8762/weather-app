const openWeatherApiKey = '3a10e933e2933f6d390c4a08de5536e0';
const openCageApiKey = '1f7fce7f50e641a6b18a02c43ec773ce';
const weatherData = document.querySelector('.weather-data');
const locationInput = document.querySelector('input');
const goButton = document.querySelector('button');

goButton.addEventListener('click', function(){
    try {
        getWeatherData();
    } catch (error) {
        console.log(error);
        alert(error);
    }
});

function getWeatherData() {
    const location = locationInput.value;
    const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${openCageApiKey}`;
    fetch(openCageUrl)
        .then(response => {
            if (!response.ok) {
                throw 'No internet connection';
            }
            return response.json();
        })
        .then(data => {
            if (data.results.length === 0) {
                throw 'Location not found';
            }
            const lat = data.results[0].geometry.lat;
            const lng = data.results[0].geometry.lng;
            const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherApiKey}&units=metric`;
            return fetch(openWeatherUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw 'No internet connection';
            }
            return response.json();
        })
        .then(data => {
            // Extract the necessary data from the API response
            const forecast = data.weather[0].description;
            const locationName = data.name;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const temperature = data.main.temp;
            // convert to Celsius
            const temperatureInCelsius = (temperature - 32) * 5/9;
            // Check if the weatherData element is present in the DOM
            if (weatherData) {
                // Display the location and forecast on the webpage
                weatherData.innerHTML = `<p>Weather in ${locationName}: ${forecast}</p> <br> <p>Humidity: ${humidity}%</p> <br> <p> Wind Speed: ${windSpeed}m/s</p> <br> <p>Temperature: ${temperatureInCelsius} C</p>`;
              } else {
                console.log("Weather data element not found in the DOM");
            }
        })
        .catch(error => {
            console.log(error);
            alert(error);
        });
}
