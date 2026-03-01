const API_KEY = "af9f63c59a649f27d602b96a43d0bd14";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const historyList = document.getElementById("historyList");
const consoleBox = document.getElementById("consoleBox");

function log(message) {
  const line = document.createElement("div");
  line.textContent = message;
  consoleBox.appendChild(line);
}

searchBtn.addEventListener("click", () => {
  
  log("1️⃣ Sync Start");

  const city = cityInput.value.trim();
  if (!city) return;

  log("2️⃣ Sync End");

  log("[ASYNC] Start fetching");

  Promise.resolve().then(() => {
    log("3️⃣ Promise.then (Microtask)");
  });

  setTimeout(() => {
    log("4️⃣ setTimeout (Macrotask)");
  }, 0);

  fetchWeather(city);
});

function fetchWeather(city) {
  fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => {
      if (!response.ok) {
        weatherInfo.innerHTML = "<span style='color:red'>City not found</span>";
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      weatherInfo.innerHTML = `
        <div class="weather-row"><span>City</span><span>${data.name}, ${data.sys.country}</span></div>
        <div class="weather-row"><span>Temp</span><span>${data.main.temp} °C</span></div>
        <div class="weather-row"><span>Weather</span><span>${data.weather[0].main}</span></div>
        <div class="weather-row"><span>Humidity</span><span>${data.main.humidity}%</span></div>
        <div class="weather-row"><span>Wind</span><span>${data.wind.speed} m/s</span></div>
      `;

      saveHistory(city);

      log("[ASYNC] Data received");
    })
    .catch(() => {});
}

function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  history = history.slice(0, 5);
  localStorage.setItem("weatherHistory", JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyList.innerHTML = "";
  history.forEach(city => {
    const item = document.createElement("span");
    item.className = "history-item";
    item.textContent = city;
    item.onclick = () => {
      cityInput.value = city;
      searchBtn.click();
    };
    historyList.appendChild(item);
  });
}

displayHistory();