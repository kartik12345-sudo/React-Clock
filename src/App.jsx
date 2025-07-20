import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "9d115f522095a9e57da470ddda5386a4";
const API_BASE = "https://api.openweathermap.org/data/2.5";

// Popular cities for search suggestions
const POPULAR_CITIES = [
  { name: "New York", country: "US", state: "NY" },
  { name: "London", country: "GB" },
  { name: "Tokyo", country: "JP" },
  { name: "Paris", country: "FR" },
  { name: "Sydney", country: "AU" },
  { name: "Dubai", country: "AE" },
  { name: "Singapore", country: "SG" },
  { name: "Los Angeles", country: "US", state: "CA" },
  { name: "Berlin", country: "DE" },
  { name: "Mumbai", country: "IN" },
  { name: "Toronto", country: "CA" },
  { name: "Amsterdam", country: "NL" },
  { name: "Barcelona", country: "ES" },
  { name: "Rome", country: "IT" },
  { name: "Moscow", country: "RU" },
  { name: "Seoul", country: "KR" },
  { name: "Beijing", country: "CN" },
  { name: "Cairo", country: "EG" },
  { name: "São Paulo", country: "BR" },
  { name: "Mexico City", country: "MX" },
  { name: "Istanbul", country: "TR" },
  { name: "Bangkok", country: "TH" },
  { name: "Buenos Aires", country: "AR" },
  { name: "Lagos", country: "NG" },
  { name: "Johannesburg", country: "ZA" },
  { name: "Delhi", country: "IN" },
  { name: "Jakarta", country: "ID" },
  { name: "Manila", country: "PH" },
  { name: "Karachi", country: "PK" },
  { name: "Shanghai", country: "CN" },
];

// Demo data for fallback
const DEMO_WEATHER = {
  name: "Demo City",
  sys: { country: "US" },
  main: { temp: 22, feels_like: 25, humidity: 65, pressure: 1013 },
  weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
  wind: { speed: 3.5 },
  visibility: 10000,
};

const DEMO_FORECAST = [
  {
    dt_txt: "2024-01-15 12:00:00",
    main: { temp: 22, temp_min: 18, temp_max: 25 },
    weather: [{ icon: "01d", main: "Clear" }],
  },
  {
    dt_txt: "2024-01-16 12:00:00",
    main: { temp: 25, temp_min: 20, temp_max: 28 },
    weather: [{ icon: "02d", main: "Clouds" }],
  },
  {
    dt_txt: "2024-01-17 12:00:00",
    main: { temp: 19, temp_min: 15, temp_max: 22 },
    weather: [{ icon: "03d", main: "Clouds" }],
  },
  {
    dt_txt: "2024-01-18 12:00:00",
    main: { temp: 23, temp_min: 19, temp_max: 26 },
    weather: [{ icon: "01d", main: "Clear" }],
  },
  {
    dt_txt: "2024-01-19 12:00:00",
    main: { temp: 21, temp_min: 17, temp_max: 24 },
    weather: [{ icon: "04d", main: "Clouds" }],
  },
];

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setTime(timeString);
      setDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          fetchWeatherByCity("New York");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 },
      );
    } else {
      fetchWeatherByCity("New York");
    }
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = POPULAR_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (city.state &&
            city.state.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      setSearchResults(filtered.slice(0, 8));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);

      const weatherResponse = await fetch(
        `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );

      if (!weatherResponse.ok) {
        throw new Error(`API Error: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();

      const forecastResponse = await fetch(
        `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );

      if (!forecastResponse.ok) {
        throw new Error(`API Error: ${forecastResponse.status}`);
      }

      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      setLocation(`${weatherData.name}, ${weatherData.sys.country}`);

      const dailyForecast = forecastData.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5);
      setForecast(dailyForecast);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);

      setWeather(DEMO_WEATHER);
      setLocation("Demo City, US (Demo Mode)");
      setForecast(DEMO_FORECAST);
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);

      const weatherResponse = await fetch(
        `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );

      if (!weatherResponse.ok) {
        throw new Error(`API Error: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();

      const forecastResponse = await fetch(
        `${API_BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );

      if (!forecastResponse.ok) {
        throw new Error(`API Error: ${forecastResponse.status}`);
      }

      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      setLocation(`${weatherData.name}, ${weatherData.sys.country}`);

      const dailyForecast = forecastData.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5);
      setForecast(dailyForecast);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);

      setWeather(DEMO_WEATHER);
      setLocation("Demo City, US (Demo Mode)");
      setForecast(DEMO_FORECAST);
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCitySelect = (city) => {
    const cityName = city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
    fetchWeatherByCity(cityName);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherByCity(searchQuery.trim());
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const getWeatherIcon = (iconCode, isLarge = false) => {
    const iconMap = {
      "01d": isLarge ? "☀️" : "☀️",
      "01n": isLarge ? "🌙" : "🌙",
      "02d": isLarge ? "⛅" : "⛅",
      "02n": isLarge ? "☁️" : "☁️",
      "03d": isLarge ? "☁️" : "☁️",
      "03n": isLarge ? "☁️" : "☁️",
      "04d": isLarge ? "☁️" : "☁️",
      "04n": isLarge ? "☁️" : "☁️",
      "09d": isLarge ? "🌧️" : "🌧️",
      "09n": isLarge ? "🌧️" : "🌧️",
      "10d": isLarge ? "🌦️" : "🌦️",
      "10n": isLarge ? "🌧️" : "🌧️",
      "11d": isLarge ? "⛈️" : "⛈️",
      "11n": isLarge ? "⛈️" : "⛈️",
      "13d": isLarge ? "🌨️" : "🌨️",
      "13n": isLarge ? "🌨️" : "🌨️",
      "50d": isLarge ? "🌫️" : "🌫️",
      "50n": isLarge ? "🌫️" : "🌫️",
    };
    return iconMap[iconCode] || "☀️";
  };

  const getDayName = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  if (loading) {
    return (
      <div className="weather-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-app">
        <div className="error-container">
          <p>Unable to load weather data</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-app">
      <div className="weather-container">
        {/* Header */}
        <header className="header">
          <div className="location-info">
            <h1 className="current-location">{location.split(",")[0]}</h1>
            <p className="current-date">{date}</p>
          </div>
          <div className="current-time">{time}</div>
        </header>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search for cities..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Search Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((city, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="city-info">
                    <span className="city-name">{city.name}</span>
                    <span className="city-details">
                      {city.state
                        ? `${city.state}, ${city.country}`
                        : city.country}
                    </span>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Weather Card */}
        <div className="main-weather-card">
          <div className="weather-main-content">
            <div className="weather-icon-section">
              <div className="main-weather-icon">
                {getWeatherIcon(weather.weather[0].icon, true)}
              </div>
              <div className="weather-description">
                <h2 className="weather-condition">{weather.weather[0].main}</h2>
                <p className="weather-detail">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            <div className="temperature-section">
              <span className="main-temperature">
                {Math.round(weather.main.temp)}°
              </span>
              <div className="temp-details">
                <p className="feels-like">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Stats Grid */}
        <div className="weather-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🌬️</div>
            <div className="stat-info">
              <span className="stat-value">{weather.wind.speed}</span>
              <span className="stat-unit">m/s</span>
              <span className="stat-label">Wind Speed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💧</div>
            <div className="stat-info">
              <span className="stat-value">{weather.main.humidity}</span>
              <span className="stat-unit">%</span>
              <span className="stat-label">Humidity</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👀</div>
            <div className="stat-info">
              <span className="stat-value">
                {Math.round(weather.visibility / 1000)}
              </span>
              <span className="stat-unit">km</span>
              <span className="stat-label">Visibility</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🌡️</div>
            <div className="stat-info">
              <span className="stat-value">{weather.main.pressure}</span>
              <span className="stat-unit">hPa</span>
              <span className="stat-label">Pressure</span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="forecast-container">
          <h3 className="forecast-title">5-Day Forecast</h3>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <div className="forecast-day">
                  {index === 0 ? "Today" : getDayName(day.dt_txt)}
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(day.weather[0].icon)}
                </div>
                <div className="forecast-temps">
                  <span className="forecast-high">
                    {Math.round(day.main.temp)}°
                  </span>
                  <span className="forecast-low">
                    {Math.round(day.main.temp_min)}°
                  </span>
                </div>
                <div className="forecast-condition">{day.weather[0].main}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
