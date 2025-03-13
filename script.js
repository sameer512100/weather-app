const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "a6f633acb9f226a044a4a935431f90b9"; // Ideally, store this in env variables

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

    card.textContent = "";
    card.style.display = "flex";

    const weatherInfo = document.createElement("p");
    const emoji = getWeatherEmoji(weather_descriptions[0]);
    weatherInfo.textContent = `City: ${city}, Time: ${localtime}, Temp: ${temperature}°C, Humidity: ${humidity}%, Condition: ${weather_descriptions[0]} ${emoji}`;
    card.appendChild(weatherInfo);
}

function getWeatherEmoji(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sunny")) return "☀️";
    if (conditionLower.includes("cloud")) return "☁️";
    if (conditionLower.includes("rain")) return "🌧️";
    if (conditionLower.includes("snow")) return "❄️";
    if (conditionLower.includes("storm")) return "⛈️";
    if (conditionLower.includes("fog")) return "🌫️";
    return "🌍"; // Default emoji
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}