import "../styles/WeatherCard.css"

export default function Weathercard({ weatherData: weather }) {

  // Then guard against null / loading

  if (!weather || !weather.current) {
    return null;
  }

  // Safe destructure air_quality with defaults

  const airQuality = weather.current.air_quality || {};
  const aqiIndex = airQuality["us-epa-index"] || 0;
  const pm25 = airQuality.pm2_5 ?? 0;
  const pm10 = airQuality.pm10 ?? 0;


  function calculateAQI(pm) {
    if (!pm || pm === 0) return "-"; 
    const ranges = [
      { cLow: 0, cHigh: 12, aLow: 0, aHigh: 50 },
      { cLow: 12.1, cHigh: 35.4, aLow: 51, aHigh: 100 },
      { cLow: 35.5, cHigh: 55.4, aLow: 101, aHigh: 150 },
      { cLow: 55.5, cHigh: 150.4, aLow: 151, aHigh: 200 },
      { cLow: 150.5, cHigh: 250.4, aLow: 201, aHigh: 300 },
      { cLow: 250.5, cHigh: 500.4, aLow: 301, aHigh: 500 },
    ];

    const r = ranges.find((p) => pm >= p.cLow && pm <= p.cHigh);
    if (!r) return "-";

    return Math.round(((r.aHigh - r.aLow) / (r.cHigh - r.cLow)) * (pm - r.cLow) + r.aLow);
  }


  //Set image according to weather conditions

  const temp = weather.current.temp_c;
  const condition = weather.current.condition.text.toLowerCase()

  let bg;
  let src;
  let icon;

  if (condition.includes("rain") || condition.includes("drizzle")) {
    bg = "/rainy-weather.avif"
    src = "/rainy-cartoon.png"
    icon = "/icons/rain.svg"
  } else if (temp <= 8) {
    bg = "/cold-weather1.avif"
    src = "/cold-cartoon.png"
    icon = "/icons/snowflake.svg"
  } else if (temp >= 35) {
    bg = "/hot-weather.avif"
    src = "/hot-cartoon.png"
    icon = "/icons/clear-day.svg"
  } else if (condition.includes("sun") || condition.includes("clear")) {
    bg = "/calm-weather1.avif"
    src = "/jumping-boy.png"
    icon = "/icons/haze.svg"
  } else {
    bg = "/clear-weather.avif"
    src = "summer-cartoon.png"
    icon = "/icons/cloudy.svg"

  }

  function getAQIStatus(index) {
    switch (index) {
      case 1: return "Good";
      case 2: return "Moderate";
      case 3: return "Sensitive";
      case 4: return "Unhealthy";
      case 5: return "Very Unhealthy";
      case 6: return "Hazardous";
      default: return "Unknown";
    }
  }

  const aqiColors = {
    1: "rgba(46, 204, 113, 0.3)",
    2: "rgba(241, 196, 15, 0.3)",
    3: "rgba(230, 126, 34, 0.3)",
    4: "rgba(231, 76, 60, 0.3)",
    5: "rgba(142, 68, 173, 0.3)",
    6: "rgba(127, 0, 0, 0.3)"
  };


  const hasError = weather?.error?.code === 1006;

  if (hasError) {
    return (
      <>
        <div id="Error-container">

          {/* Animated city icon */}
          <svg
            className="city-icon"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Buildings */}
            <rect x="24" y="44" width="24" height="44" rx="4" fill="none" stroke="#7FFF00" strokeWidth="6" />
            <rect x="52" y="32" width="28" height="56" rx="4" fill="none" stroke="#7FFF00" strokeWidth="6" />
            <rect x="84" y="52" width="20" height="36" rx="4" fill="none" stroke="#7FFF00" strokeWidth="6" />

            {/* Windows */}
            <g stroke="#7FFF00" strokeWidth="4">
              <line x1="32" y1="56" x2="32" y2="56" />
              <line x1="32" y1="66" x2="32" y2="66" />
              <line x1="66" y1="44" x2="66" y2="44" />
              <line x1="66" y1="54" x2="66" y2="54" />
            </g>
          </svg>

          <p className="error-text">
            Uh-oh! That city seems lost. Maybe try a nearby town or a different spelling?
          </p>
        </div>

        <section className="about no-result">
          <h2>Location Not Found</h2>
          <p>
            This card appears when the weather service is unable to find any matching
            location for the city name you entered. The search may fail if the spelling
            is incorrect, the location is very small, or the city is not recognized
            by the weather data provider.
          </p>

          <p>
            To improve your search results, try entering a more common city name,
            checking for spelling errors, or including additional details such as
            the country or region where the city is located.
          </p>

          <p>
            Weather data is retrieved in real time from a global weather service.
            When a valid location is found, the card updates instantly to show
            current temperature, weather conditions, and air quality information.
          </p>

          <p>
            If you continue to see this message, it may be due to temporary service
            issues or network problems. Refreshing the page or trying again after
            a short time may help resolve the issue.
          </p>

          <p>
            Once a valid city is detected, this card will automatically switch back
            to displaying live weather and air quality details to help you plan
            your day with confidence.
          </p>
        </section>
      </>
    );
  }


  return (

    <>
      <div id="weather-container" style={{ "--bg-img": `url(${bg})` }} >

        <div className="city box">
          <h2>{weather.location.name} Weather Conditions</h2>
          <h3>Current Temperature Level</h3>
        </div>
        <div className="tempareture temp-box">
          <div className="temp">
            <span id="temp">{Math.floor(weather.current.temp_c)}</span><b>&deg; C </b><br />
          </div>

          <div className="temp-info">
            <img className="weather-icon" src={icon} alt="weather_icon"></img>
            <div className="temp-sub-info">
              <span className="sub-info"><b>{weather.current.condition.text}</b></span>
              <span className="sub-info">Feels Like {Math.floor(weather.current.feelslike_c)}</span>
              <span className="sub-info">Humidity {weather.current.humidity}%</span>

            </div>

          </div>

        </div>
        <p className="update-time">
          Last Updated: {weather.location.localtime} (Local Time)
        </p>

        <div className="boy-img">
          <img src={src} alt="weather_cartoon_img" />
        </div>

        <div className="card" style={{ backgroundColor: aqiColors[aqiIndex] ?? "rgba(128,128,128,0.3)" }}>
          <span id="g2r1">Air Quality Index <hr /></span> <br />
          <span id="g2r2c1" className="aqinumber vertical-line">{calculateAQI(pm25)}<span id="aqitext">AQI</span></span><br />

          <span id="g2r2c2">
            PM2.5: &nbsp; <b>{pm25 ? Math.floor(pm25) : "-"} </b> <br />
            PM10: &nbsp; <b> {pm10 ? Math.floor(pm10) : "-"} </b><br />
          </span> <br />
          <span id="g2r3">Air quality index is: {getAQIStatus(aqiIndex)}</span>
        </div>
      </div>

      <section className="about">
        <h2 className="hero">Understanding This Weather Card</h2>

        <p>
          This weather card provides a clear snapshot of the current weather and air quality
          conditions for the selected city. All information is presented in a simple,
          visual format so you can quickly understand what the weather feels like right now.
        </p>

        <p>
          The temperature section displays the current temperature, how it feels, humidity
          levels, and the prevailing weather condition such as sunny, cloudy, or rainy.
          Visual icons and background imagery change dynamically to reflect these conditions,
          making the data easier to interpret at a glance.
        </p>

        <p>
          The Air Quality Index (AQI) card highlights the current air quality using a numeric
          AQI value along with a color-coded background. The AQI status ranges from
          <strong> Good</strong> to <strong>Hazardous</strong>, helping you understand whether
          outdoor activities are safe or should be limited.
        </p>

        <p>
          Fine particulate matter values (PM2.5 and PM10) are also displayed to provide deeper
          insight into air pollution levels. PM2.5 represents smaller particles that can
          penetrate deep into the lungs, while PM10 includes larger particles such as dust.
          These values are especially important for children, elderly individuals, and
          people with respiratory conditions.
        </p>

        <p>
          By combining weather conditions and air quality information into a single card,
          this view helps you make informed decisions about outdoor plans, travel, and daily
          activities based on real-time environmental data.
        </p>
      </section>

    </>
  )
}