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

export default function Weather_App() {
  const { theme } = useTheme();

  // Initial dummy data while fetching

  const dummyWeather = {
    location: { name: "New York", localtime: "2025-12-26 10:00" },
    current: {
      temp_c: 25,
      feelslike_c: 24,
      condition: { text: "Sunny" },
      humidity: 60,
      air_quality: { "us-epa-index": 2, pm2_5: 15, pm10: 20 },
    },
  };


  const [weatherData, setWeatherData] = useState(dummyWeather);
  const [selectedCity, setSelectedCity] = useState("New York");
  const [loading, setLoading] = useState(true);

  function handleSearch(weatherResponse) {
    setWeatherData(weatherResponse);

    if (weatherResponse?.location?.name) {
      setSelectedCity(weatherResponse.location.name);
    }
  }

  useEffect(() => {
    async function fetchCityAndWeather() {
      try {
        // Fetch city from backend
        const locRes = await fetch("/api/location");
        if (!locRes.ok) throw new Error("Failed to fetch city");
        const locData = await locRes.json();
        const userCity = locData.city;
        setSelectedCity(userCity);

        // Fetch weather for that city
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

  if (loading) return <div style={{margin:'5px', fontWeight: "550"}}>Loading weather...</div>;

  return (
    <Router>
      <>
        <Navbar onSearch={handleSearch} />
        <main className={`main-content ${theme}`}>
          <Routes>
            <Route path="/" element={<Weathercard weatherData={weatherData} />} />
            <Route path="/forecast" element={<Forecast city={selectedCity} />} />
            <Route path="/airquality" element={<AirQuality city={weatherData} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </>
    </Router>
  );
}
