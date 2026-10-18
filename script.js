const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");


// Get weather
async function getWeather(city) {

    try {

        errorMessage.textContent = "";

        // 1. Find city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Location search failed");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // 2. Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather data unavailable");
        }

        const data = await weatherResponse.json();

        console.log(data);

        // 3. Extract data
        const cityNameValue = location.name;
        const temp = data.current.temperature_2m;
        const humidityValue = data.current.relative_humidity_2m;
        const wind = data.current.wind_speed_10m;
        const weatherCode = data.current.weather_code;

        // 4. Display data
        cityName.textContent = cityNameValue;

        temperature.textContent =
            `${temp} °C`;

        humidity.textContent =
            `${humidityValue} %`;

        windSpeed.textContent =
            `${wind} km/h`;

        description.textContent =
            getWeatherDescription(weatherCode);

        weatherCard.style.display = "block";

    } catch (error) {

        console.error(error);

        weatherCard.style.display = "none";

        errorMessage.textContent =
            "❌ City not found or weather data unavailable.";
    }
}


// Convert weather code into text
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky ☀️";
    }

    if (code >= 1 && code <= 3) {
        return "Partly Cloudy ⛅";
    }

    if (code >= 45 && code <= 48) {
        return "Foggy 🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "Rainy 🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy ❄️";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers 🌦️";
    }

    if (code >= 95 && code <= 99) {
        return "Thunderstorm ⛈️";
    }

    return "Unknown Weather";
}


// Search button
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {

        errorMessage.textContent =
            "Please enter a city name.";

        return;
    }

    getWeather(city);
});


// Search using Enter
cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});