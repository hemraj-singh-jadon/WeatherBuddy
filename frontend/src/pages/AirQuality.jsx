import "../styles/AirQuality.css";

const AirQuality = ({ city: weatherData }) => {
  if (!weatherData) return null;


  /* ---------------- AQI CALCULATION (PM2.5 based) ---------------- */

  const airQuality = weatherData.current.air_quality || {};
  const pm25 = airQuality.pm2_5 ?? 0;
  const pm10 = airQuality.pm10 ?? 0;

  /* ---------------- AQI CALCULATION (PM2.5 based) ---------------- */
  function calculateAQI(pm) {
    if (!pm || pm === 0) return "-"; // fallback for missing data

    const ranges = [
      { cLow: 0, cHigh: 12, aLow: 0, aHigh: 50 },
      { cLow: 12.1, cHigh: 35.4, aLow: 51, aHigh: 100 },
      { cLow: 35.5, cHigh: 55.4, aLow: 101, aHigh: 150 },
      { cLow: 55.5, cHigh: 150.4, aLow: 151, aHigh: 200 },
      { cLow: 150.5, cHigh: 250.4, aLow: 201, aHigh: 300 },
      { cLow: 250.5, cHigh: 500.4, aLow: 301, aHigh: 500 },
    ];

    const r = ranges.find((p) => pm >= p.cLow && pm <= p.cHigh);
    if (!r) return "-"; // fallback if no range matches

    return Math.round(((r.aHigh - r.aLow) / (r.cHigh - r.cLow)) * (pm - r.cLow) + r.aLow);
  }
  const aqi = calculateAQI(pm25);

  const aqiLevels = [
    {
      level: "Good",
      range: 50,
      color: "#4caf50",
      desc: "Air quality is satisfactory and poses little or no risk.",
      tips: "Ideal conditions for outdoor activities."
    },
    {
      level: "Moderate",
      range: 100,
      color: "#ffeb3b",
      desc: "Air quality is acceptable; sensitive individuals may experience discomfort.",
      tips: "Sensitive groups should reduce prolonged outdoor exertion."
    },
    {
      level: "Poor",
      range: 200,
      color: "#ff9800",
      desc: "Air quality may affect health for the general population.",
      tips: "Limit outdoor exposure and wear masks if needed."
    }
  ];

  const filter =
    aqiLevels.find(el => el.range >= aqi) || {
      level: "Very Poor",
      color: "#f44336",
      desc: "Health warnings of emergency conditions.",
      tips: "Avoid outdoor activities and use protective masks."
    };

  return (
    <div
      className="aq-page"
      style={{
        minHeight: "100vh",
        padding: "60px 20px"
      }}
    >
      {/* ---------------- HERO ---------------- */}
      <section className="aq-hero">
        <h1 className="accent-color">Air Quality Tracker</h1>
        <p>
          Monitor real-time air pollution levels and understand how air quality
          affects your health in <b>{weatherData.location.name}</b>.
        </p>
      </section>

      {/* ---------------- WHAT IS AQI ---------------- */}
      <section className="aq-section">
        <h2>What is Air Quality Index (AQI)?</h2>
        <p>
          The Air Quality Index (AQI) is a standardized measurement used to
          communicate how polluted the air currently is and the potential health
          effects associated with different pollution levels.
        </p>
        <p>
          A higher AQI value indicates poorer air quality and a greater risk to
          human health, especially for children, the elderly, and individuals
          with respiratory conditions.
        </p>
      </section>

      {/* ---------------- AQI CARD ---------------- */}
      <section
        className="aq-card"
        style={{
          backgroundColor: filter.color + "22",
          borderLeft: `8px solid ${filter.color}`
        }}
      >
        <h2 className="aq-city">{weatherData.location.name}</h2>
        <p className="aq-note">Live air quality snapshot (current conditions)</p>

        <div className="aq-main">
          <span className="aq-value">{aqi}</span>
          <span className="aq-level" style={{ color: filter.color }}>
            {filter.level}
          </span>
        </div>

        <p className="aq-desc">{filter.desc}</p>
        <p className="aq-desc"><b>Health advice:</b> {filter.tips}</p>

        <div className="aq-pollutants">
          <div>
            <span>PM2.5</span>
            <strong>{pm25 ? Math.floor(pm25) : "-"} µg/m³</strong>
          </div>
          <div>
            <span>PM10</span>
            <strong>{pm10 ? Math.floor(pm10) : "-"} µg/m³</strong>
          </div>
        </div>
      </section>

      {/* ---------------- PM EXPLANATION ---------------- */}
      <section className="aq-section">
        <h2>Understanding PM2.5 & PM10</h2>

        <div className="aq-grid">
          <div className="aq-box">
            <h3>PM2.5 (Fine Particles)</h3>
            <p>
              PM2.5 particles are extremely small and can penetrate deep into the
              lungs and bloodstream.
            </p>
            <p><b>Major sources:</b> Vehicle emissions, fuel burning, industry</p>
            <p><b>Health risk:</b> High</p>
          </div>

          <div className="aq-box">
            <h3>PM10 (Coarse Particles)</h3>
            <p>
              PM10 particles are larger and typically affect the nose, throat,
              and upper respiratory tract.
            </p>
            <p><b>Major sources:</b> Road dust, construction, pollen</p>
            <p><b>Health risk:</b> Moderate</p>
          </div>
        </div>
      </section>

      {/* ---------------- AQI DIFFERENCE NOTE ---------------- */}
      <section className="aq-section">
        <h2>Why AQI Values May Differ From Google</h2>
        <p>
          AQI readings can vary between platforms due to differences in data
          sources, sensor locations, averaging methods, and update frequency.
        </p>
        <p>
          WeatherBuddy uses WeatherAPI data, which may not exactly match values
          shown by Google or local government stations.
        </p>
      </section>

      {/* ---------------- AQI TABLE ---------------- */}
      <section className="aq-section">
        <h2>AQI Levels & Health Impact</h2>

        <table className="aq-table">
          <thead>
            <tr>
              <th>AQI Range</th>
              <th>Category</th>
              <th>Health Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>0–50</td><td>Good</td><td>Air quality is satisfactory</td></tr>
            <tr><td>51–100</td><td>Moderate</td><td>Sensitive individuals may experience discomfort</td></tr>
            <tr><td>101–150</td><td>Unhealthy for Sensitive Groups</td><td>People with respiratory issues may be affected</td></tr>
            <tr><td>151–200</td><td>Unhealthy</td><td>Everyone may experience health effects</td></tr>
            <tr><td>201+</td><td>Very Unhealthy</td><td>Serious health effects for all groups</td></tr>
          </tbody>
        </table>
      </section>

      {/* ---------------- TIPS ---------------- */}
      <section className="aq-section">
        <h2  className="accent-color">Tips for Cleaner Air</h2>
        <ul className="aq-tips">
          <li>Limit outdoor activities during high AQI levels</li>
          <li>Wear masks on polluted days</li>
          <li>Keep indoor plants to improve air quality</li>
          <li>Avoid unnecessary vehicle usage</li>
          <li>Monitor air quality regularly</li>
        </ul>
      </section>
    </div>
  );
};

export default AirQuality;
