import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar({ onSearch }) {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleSwitchChange = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  return (
    <div className="navdiv">
      <Link to="/" className="logo-link">
        <img src="/wind1.png" alt="logo" />
        <span>WeatherBuddy</span>
      </Link>

      <div className="search anchor">
        <SearchBox onSearch={onSearch} />
      </div>

      <div className="forecast anchor">
        <Link to="/forecast" className="nav-link">Forecast</Link>
      </div>

      <div className="airquality anchor">
        <Link to="/airquality" className="nav-link">Airquality</Link>
      </div>

      <div className="navabout anchor">
        <Link to="/about" className="nav-link">About</Link>
      </div>

      <div className="mode anchor">
        <label className="switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={handleSwitchChange}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
}
