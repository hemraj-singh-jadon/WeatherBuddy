import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>WeatherBuddy</h1>
        <p>
          Your trusted companion for accurate weather forecasts, air quality updates,
          and city-wise temperature tracking across India. Stay informed, stay safe,
          and plan your day with confidence.
        </p>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At WeatherBuddy, our mission is to provide reliable, real-time weather information
          through an intuitive interface. We aim to empower users to make informed decisions
          and stay prepared for any weather condition. By combining accurate data with
          interactive tools, we help you plan your day, your travel, or your outdoor activities
          efficiently.
        </p>
        <p>
          Beyond forecasting, we are committed to raising awareness about air quality and
          environmental factors. Our platform provides actionable insights so users can
          safeguard their health and adapt their routines accordingly. Whether for personal
          planning or professional use, WeatherBuddy aims to be the most trusted and user-friendly
          weather companion in India.
        </p>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>14-Day Forecast</h3>
            <p>Plan ahead with accurate temperature predictions for major cities across India.</p>
          </div>
          <div className="feature-card">
            <h3>Air Quality Updates</h3>
            <p>Stay safe with real-time Air Quality Index (AQI) updates for your region.</p>
          </div>
          <div className="feature-card">
            <h3>City Search</h3>
            <p>Quickly search for any city and get instant weather information.</p>
          </div>
          <div className="feature-card">
            <h3>Visual Charts</h3>
            <p>Compare temperatures across cities easily with interactive bar charts.</p>
          </div>
          <div className="feature-card">
            <h3>Dark & Light Mode</h3>
            <p>Toggle between modes for comfortable viewing day and night.</p>
          </div>
          <div className="feature-card">
            <h3>Custom Alerts</h3>
            <p>Receive notifications for severe weather, heat waves, or air quality changes in your city.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="about-why">
        <h2>Why Choose WeatherBuddy?</h2>
        <p>
          WeatherBuddy combines accurate meteorological data with a user-friendly interface.
          Whether you’re checking the forecast for your city, comparing temperatures across
          regions, or monitoring air quality, all the information is available in one place.
        </p>
        <p>
          Our platform is designed for everyone — from casual users planning their day to
          professionals who rely on precise weather and environmental data. Neon green accents
          highlight critical information, ensuring readability in both light and dark modes.
        </p>
      </section>

      {/* Call-to-Action Section */}
      <section className="about-cta">
        <p>Join thousands of users who trust WeatherBuddy for daily weather updates.</p>
        <button>Get Started</button>
      </section>
    </div>
  );
};

export default About;
