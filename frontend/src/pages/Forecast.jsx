import "../styles/Forecast.css";
import { fetchWeather } from "../services/WeatherHelper";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const cities = [
  "Mumbai", "New Delhi", "Bengaluru", "Kolkata", "Chennai",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Surat", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad"
];

const dummyDataSet = [
  20.5, 21, 21.6
];

const Forecast = ({ city }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* ---------------- GRAPH STATE ---------------- */
  const [graphData, setGraphData] = useState(dummyDataSet);

  /* ---------------- TABLE STATE ---------------- */
  const [weatherData, setWeatherData] = useState([]);

  /* ---------------- FETCH FORECAST GRAPH DATA ---------------- */

  useEffect(() => {
    if (!city) return;

    async function fetchForecast() {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
        );

        if (!response.ok) throw new Error("Forecast API failed");

        const res = await response.json();
        const forecastDays = res?.forecast?.forecastday;

        const values =
          Array.isArray(forecastDays) && forecastDays.length
            ? forecastDays.map(day => day.day.avgtemp_c)
            : dummyDataSet;

        setGraphData(values);

      } catch (error) {
        console.error("Using dummy forecast data:", error);
        setGraphData(dummyDataSet);
      }
    }

    fetchForecast();

  }, [city]);

  /* ---------------- FETCH CITY TABLE DATA (CACHED) ---------------- */

  useEffect(() => {
    const today = new Date().toDateString();
    const lastFetch = localStorage.getItem("lastFetch");
    const storedData = localStorage.getItem("weatherData");

    if (storedData) {
      setWeatherData(JSON.parse(storedData));
    }

    if (lastFetch === today && storedData) return;

    async function fetchAllCities() {
      try {
        const results = await Promise.all(
          cities.map(async (city) => {
            const res = await fetchWeather(city);
            return {
              city: res.location.name,
              temperature: res.current.temp_c,
              status: deriveStatus(res.current.temp_c),
              condition: res.current.condition.text,
            };
          })
        );

        setWeatherData(results);
        localStorage.setItem("weatherData", JSON.stringify(results));
        localStorage.setItem("lastFetch", today);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    }

    fetchAllCities();
  }, []);

  /* ---------------- HELPERS ---------------- */
  function deriveStatus(temp) {
    if (temp >= 35) return "Hot";
    if (temp >= 25) return "Warm";
    if (temp >= 15) return "Mild";
    return "Cold";
  }

  /* ---------------- CHART CONFIG ---------------- */
  const labels = graphData.map((_, i) => `Day ${i + 1}`);
  const textColor = isDark ? "#fff" : "#000";
  const gridColor = isDark ? "#ffffff22" : "#ddd";


const temps = graphData;
const minTemp = Math.min(...temps);
const maxTemp = Math.max(...temps);
const range = maxTemp - minTemp;

const barColors = temps.map(t => {
  const ratio = (t - minTemp) / range; // 0 = min, 1 = max

  if (ratio <= 0.25) return "#4da3ff"; 
  if (ratio <= 0.5)  return "#4caf50"; 
  if (ratio <= 0.75) return "#ff9800";
  return "#f44336";                    
});

  const data = {
    labels,
    datasets: [
      {
  
        data: graphData,
        backgroundColor: barColors,
        borderRadius: 6,
        maxBarThickness: 60,
      },
    ],
  };

  const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: `3-Day Temperature Forecast for ${city}`,
      color: textColor, // ✅ applies to title
      font: { size: 20, weight: "bold" },
      padding: { bottom: 50 },
    },
    legend: {
      display: false,
      labels: { color: textColor }, // ✅ legend text color
    },
  },
  scales: {
    x: {
      ticks: { color: textColor },  // ✅ x-axis labels color
      grid: { color: gridColor },   // ✅ x-axis grid line color
      title: { display: true, text: "Days", color: textColor, font: { size: 16 } },
    },
    y: {
      ticks: {
        color: textColor,            // ✅ y-axis labels color
        callback: (v) => `${v}°C`,
      },
      grid: { color: gridColor },     // ✅ y-axis grid line color
      title: { display: true, text: "Temperature", color: textColor, font: { size: 16 } },
    },
  },
};

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* GRAPH */}
      <div style={{ width: "850px", height: "500px", margin: "80px auto" }}>
        <Bar key={theme} data={data} options={options} />
      </div>

      {/* GRAPH DESCRIPTION */}
<div
  style={{
    width: "850px",
    margin: "30px auto",
    textAlign: "center",
    color: textColor,
  }}
>
  <h2>3-Day Temperature Forecast</h2>
  <p>
    The bar chart above represents the predicted average temperatures for the selected city over the next 3 days. 
    Each bar corresponds to a single day, showing the expected temperature in Celsius.
  </p>
  <p>
    The colors of the bars indicate temperature ranges: <br />
    <span style={{ color: "#4da3ff", fontWeight: "bold" }}> blue</span> for the coolest days,
    <span style={{ color: "#4caf50", fontWeight: "bold" }}> green</span> for mild-cool days, 
    <span style={{ color: "#ffca28", fontWeight: "bold" }}> yellow</span> for warm days, and 
    <span style={{ color: "#f44336", fontWeight: "bold" }}> red</span> for the hottest days.
  </p>
  <p>
    This visual representation allows you to quickly identify temperature trends, 
    spot the hottest and coolest days, and plan accordingly. 
    The dynamic color coding makes it easy to compare temperatures across the 3-day forecast at a glance.
  </p>
</div>


      {/* TABLE */}
      <div className="cityweather">
        <table className="no-border">
          <caption>Temperature Ranking: India’s Top 20 Cities</caption>
          <thead>
            <tr>
              <th>Rank</th>
              <th>City</th>
              <th>Temperature</th>
              <th>Status</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.map((item, index) => (
              <tr key={item.city}>
                <td>{index + 1}</td>
                <td>{item.city}</td>
                <td>{item.temperature}°C</td>
                <td>{item.status}</td>
                <td>{item.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
    style={{
      width: "850px",
      margin: "20px auto 120px",
      textAlign: "center",
      color: textColor,
    }}
  >
    <section className="city-temperatures">
  <h2 className="hero">Current Temperatures Across Major Indian Cities</h2>

  <p>
    Across India, temperatures show interesting regional patterns. Northern areas typically experience cooler
    mornings and evenings, while central and southern regions remain warmer throughout the day. Coastal
    cities often feel more humid, while inland cities experience drier air.
  </p>

  <p>
    Understanding these general trends helps users plan their daily activities, anticipate heat or cold, and
    stay comfortable whether traveling, working outdoors, or enjoying leisure time. Seasonal variations also
    affect temperatures, with summers bringing higher heat in central and southern regions, and winters
    bringing chillier mornings in the north.
  </p>

  <p>
    WeatherBuddy provides a snapshot of current conditions, allowing users to quickly gauge the relative
    warmth or coolness of cities across India. This overview ensures that whether you’re planning your day
    or your travels, you have actionable information at a glance.
  </p>
</section>

  </div>
</div>
    </>
  );
};

export default Forecast;
