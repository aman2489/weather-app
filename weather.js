
let weatherImg = document.querySelector(".weather-info img");
let tempreture = document.querySelector(".temp");
let city = document.querySelector(".city");
let desc = document.querySelector(".desc");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");

const searchForm = document.querySelector(".search-box");
const searchInput = searchForm.querySelector("input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();           // page reload stop
  const city = searchInput.value.trim();
  if (!city) return;

  weatherByCity(city);
  searchInput.value = "";
});

function getWeatherURL(condition){
    switch(condition){
        case "Clear": return "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/clear-day.svg";
        case "Clouds": return "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/cloudy.svg";
        case "Drizzle":
        case "Rain": return "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/rain.svg";
        case "Thunderstorm": return "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/thunderstorms.svg";
        case "Snow": return "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/snow.svg";
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Fog": return "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/fog.svg";
        default: return "https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/clear-day.svg";
    }
}

function updateUI(data){
    tempreture.textContent = `${Math.round(data.main.temp)}°C`;
    city.textContent = `${data.name}`;
    desc.textContent = `${data.weather[0].description}`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed*3.6)}km/h`;
    const condition = data.weather[0].main;
    weatherImg.src = getWeatherURL(condition);
}



function getLocation(){
    return new Promise((resolve, reject) => {

        if(!"geolocation" in navigator){
            reject("geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition((positon) => {
            resolve({
                lat: positon.coords.latitude,
                lon: positon.coords.longitude
            });
        },
        (error) => {
            reject(error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000
        } 
    );
    });
}

async function weatherByCoords(lat, lon){
    const apiKey = 'ed48601327fd95f6474016a516b45c78';
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`

    const res = await fetch(URL);
    if(!res.ok){
        throw new Error("weather API error");
    }
    const data = await res.json();
    console.log("Weather Details by location: ", data);
    updateUI(data);

}

async function weatherByCity(city){
    const apiKey = 'ed48601327fd95f6474016a516b45c78';
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    
    const res = await fetch(URL);
    if(!res.ok){
        throw new Error("city weather API error");
    }
    const data = await res.json();
    console.log(`Weather deatils of ${city}: `, data);
    updateUI(data)
}

async function startApp(){
    try{
        const {lat, lon} = await getLocation();
        console.log("user location found");
        await weatherByCoords(lat, lon);

    }catch(err){
        console.error("Location not available: ", err);
        console.log("Fetching weather of abu road instead...");
        await weatherByCity("abu road");
    }
}

startApp();


// const locationn = getLocation()
// .then(value => console.log(value));