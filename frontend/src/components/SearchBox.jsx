import { useEffect, useState } from "react";
import { fetchWeather, getCitySuggestions } from "../services/WeatherHelper";
import countryEmoji from "country-emoji";
import ReactCountryFlag from "react-country-flag"

export default function SearchBox({ onSearch }) {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);


  // Fetch weather (search intent)

  async function searchWeather(city) {
    if (!city) return;

    try {
      const res = await fetchWeather(city);

      if (res.error) {
        onSearch(dummyWeatherForError);
        return;
      }

      onSearch(res);
    
    } catch {
      onSearch(dummyWeatherForError);
    }
  }

  // Fetch suggestions (typing intent)

  async function fetchSuggestions(text) {
    try {
      const cityList = await getCitySuggestions(text);
      setSuggestions(cityList || []);
    } catch {
      setSuggestions([]);
    }
  }


  // Suggestions effect (typing only)
 
  useEffect(() => {
    if (!isTyping) return;

    if (searchText.length > 2) {
      fetchSuggestions(searchText);
    } else {
      setSuggestions([]);
    }
  }, [searchText, isTyping]);


  // Submit search

  function handleSubmit(e) {
    e.preventDefault();
    setIsTyping(false);
    setSuggestions([]);
    searchWeather(searchText.trim());
  }


  // Select suggestion
 
  function handleSelect(city) {
    setIsTyping(false);
    const value = `${city.name} ${city.country}`;
    setSearchText(value);   // update input
    setSuggestions([]);     // close dropdown
    searchWeather(value);   // trigger search
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="searchBox">
        <input
          type="text"
          value={searchText}
          onChange={(e) => { setIsTyping(true); setSearchText(e.target.value); }}
          onBlur={() => setTimeout(() => setSuggestions([]))}
          autoComplete="off"
          placeholder="Search City"
          required
          className="input-search"
        />


        <div id="searchinputbox" className={`suggestions ${suggestions.length ? "open" : ""}`}>
          <ul>
            {suggestions.map((city, index) => {
              const code = countryEmoji.code(city.country);

              return (
                <li
                  key={index}
                  className="searchanc"
                  onMouseDown={() => handleSelect(city)}
                >


                  <div
                    id="country-flag-container"
                  >
                    <ReactCountryFlag
                      countryCode={code}
                      svg
                      id="country-flag"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  {city.name}, {city.country}
                </li>


              );
            })}
          </ul>
        </div>

      </div>

      <button className="button">Search</button>
    </form>
  );
}


// Dummy error fallback

const dummyWeatherForError = {
  location: { name: "New York", localtime: "2025-12-26 10:00" },
  current: {
    temp_c: 25,
    feelslike_c: 24,
    condition: { text: "Sunny" },
    humidity: 60,
    air_quality: { "us-epa-index": 2, pm2_5: 15, pm10: 20 }
  },
  error: { code: 1006, message: "No matching location found" }
};
