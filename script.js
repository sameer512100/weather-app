const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "a6f633acb9f226a044a4a935431f90b9";

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError("Could not fetch weather data. Please try again later.");
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

function displayWeatherInfo(data) {
    if (!data || !data.current) {
        displayError("Invalid weather data received.");
        return;
    }

    const {
        location: { name: city, localtime },
        current: { temperature, humidity, weather_descriptions }
    } = data;

    card.innerHTML = `
        <h1 class="cityDisplay">${city}</h1>
        <p class="timeDisplay">Time: ${localtime}</p>
        <p class="tempDisplay">${temperature}°C</p>
        <p class="humidityDisplay">Humidity: ${humidity}%</p>
        <p class="descDisplay">${weather_descriptions[0]}</p>
        <p class="weatherEmoji">${getWeatherEmoji(weather_descriptions[0])}</p>
    `;
    card.style.display = "flex";
}

function getWeatherEmoji(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sunny")) return "☀️";
    if (conditionLower.includes("cloud")) return "☁️";
    if (conditionLower.includes("rain")) return "🌧️";
    if (conditionLower.includes("snow")) return "❄️";
    if (conditionLower.includes("storm")) return "⛈️";
    if (conditionLower.includes("fog")) return "🌫️";
    return "🌍";
}

function displayError(message) {
    card.innerHTML = `<p class="errorDisplay">${message}</p>`;
    card.style.display = "flex";
}