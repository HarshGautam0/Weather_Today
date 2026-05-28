const apiKey = "267cf8195cd9097539634450a3813603";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
function getWindDirection(deg) {
  // Add 180 degrees to find the opposite side of the compass (where it is going)
  const destinationDeg = (deg + 180) % 360;

  // The 16 refined compass points
  const directions = [
    "North",
    "North-NorthEast",
    "NorthEast",
    "East-NorthEast",
    "East",
    "East-SouthEast",
    "SouthEast",
    "South-SouthEast",
    "South",
    "South-SouthWest",
    "SouthWest",
    "West-SouthWest",
    "West",
    "West-NorthWest",
    "NorthWest",
    "North-NorthWest",
  ];
  // Divides 360 degrees into 16 segments of 22.5 degrees each
  const index = Math.round(destinationDeg / 22.5) % 16;
  return "Towards " + directions[index];
}

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather_icon");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    var data = await response.json();
    console.log(data);

    // 1. Safely extract wind degrees from API response
    const windDegrees =
      data.wind && data.wind.deg !== undefined ? data.wind.deg : 0;

    // 2. Get the highly accurate 16-direction text string
    const compassText = getWindDirection(windDegrees);

    document.querySelector(".sunrise").innerHTML =
      "Sunrise: " + new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.querySelector(".sunset").innerHTML =
      "Sunset: " + new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°c";
    document.querySelector(".temp_feel").innerHTML =
      "Feels like: " + data.main.feels_like + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    // 3. Update the UI text box (e.g., Towards North-NorthWest (150°))
    document.querySelector(".wind-arrow").innerHTML =
      `${compassText} (${windDegrees}°)`;

    // 4. Spin your SVG arrow image exactly towards the destination angle
    document.querySelector(".wind-img").style.transform =
      `rotate(${windDegrees + 180}deg)`;

    // Make sure your weather display block is visible
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}
// Triggers the API request when you click the search glass icon
searchBtn.addEventListener("click", () => {
  if (searchBox.value.trim() !== "") {
    checkWeather(searchBox.value);
  }
});

// Triggers the API request when you type a city and hit the "Enter" key
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && searchBox.value.trim() !== "") {
    checkWeather(searchBox.value);
  }
});

/*searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
checkWeather();*/
