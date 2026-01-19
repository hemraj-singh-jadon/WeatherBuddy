import Navbar from "../pages/Navbar.jsx";
import Footer from "../pages/Footer.jsx";
import Weathercard from "../pages/WeatherCard.jsx";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Forecast from "../pages/Forecast.jsx";
import AirQuality from "../pages/AirQuality.jsx";
import About from "../pages/About.jsx";
import { fetchWeather } from "../services/WeatherHelper.js";

import { useTheme } from "../context/ThemeContext";

// Reuse your error page styling for loading message

function LoadingErrorPage({ message }) {
  return (
    <div id="Loading-container">
      {/* Animated city icon */}
      <svg
        className="error-svg-icon"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="14" fill="none" stroke="#7FFF00" strokeWidth="4" />
        <g stroke="#7FFF00" strokeWidth="2">
          <line x1="32" y1="4" x2="32" y2="14" />
          <line x1="32" y1="50" x2="32" y2="60" />
          <line x1="4" y1="32" x2="14" y2="32" />
          <line x1="50" y1="32" x2="60" y2="32" />
          <line x1="12" y1="12" x2="18" y2="18" />
          <line x1="46" y1="46" x2="52" y2="52" />
          <line x1="12" y1="52" x2="18" y2="46" />
          <line x1="46" y1="18" x2="52" y2="12" />
        </g>
      </svg>

      <p className="loading-text">{message}</p>
    </div>
  );
}

export default function Weather_App() {

  const { theme } = useTheme();

  // Check localStorage first
  const lastCity = localStorage.getItem("lastCity");

  const [weatherData, setWeatherData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(lastCity || ""); 
  const [loading, setLoading] = useState(!lastCity); 

  // User search handler
  function handleSearch(weatherResponse) {
    setWeatherData(weatherResponse);
    if (weatherResponse?.location?.name) {
      setSelectedCity(weatherResponse.location.name);
      localStorage.setItem("lastCity", weatherResponse.location.name);
    }
  }

  useEffect(() => {
    // If we already have a last city, skip IP fetch
    if (lastCity) {
      // fetch weather for lastCity only
      fetchWeather(lastCity)
        .then((weather) => setWeatherData(weather))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
      return;
    }

    // Otherwise, first visit → fetch IP city
    const BASE_URL = "https://weatherbuddy-18d2.onrender.com";
    async function fetchCityAndWeather() {
      try {
        const locRes = await fetch(`${BASE_URL}/api/location`);
        if (!locRes.ok) throw new Error("Failed to fetch city");
        const locData = await locRes.json();
        const userCity = locData.city;
        console.log("usercity", userCity)

        setSelectedCity(userCity);
        localStorage.setItem("lastCity", userCity); // save first city

        const weather = await fetchWeather(userCity);
        setWeatherData(weather);
      } catch (err) {
        console.error("Error fetching city or weather:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCityAndWeather();
  }, []);

  return (
    <Router>
      <>
        <Navbar onSearch={handleSearch} />
        <main className={`main-content ${theme}`}>
          {loading || !weatherData ? (<LoadingErrorPage message="Loading weather..." />) : 
          (
            <Routes>
              <Route path="/" element={<Weathercard weatherData={weatherData} />} />
              <Route path="/forecast" element={<Forecast city={selectedCity} />} />
              <Route path="/airquality" element={<AirQuality city={weatherData} />} />
              <Route path="/about" element={<About />} />
            </Routes>
          )}
        </main>
        <Footer />
      </>
    </Router>
  );
}
