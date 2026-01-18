
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


async function fetchWeather(city) {

    let res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`)

    let resObj = await res.json()
    
    return resObj
}

// let cityListArray = [];

async function getCitySuggestions(city) {

    let cityarray = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${city}`)

    let citylist = await cityarray.json()
    
    return citylist
}



export {fetchWeather, getCitySuggestions}


