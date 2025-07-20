import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "9d115f522095a9e57da470ddda5386a4";
const API_BASE = "https://api.openweathermap.org/data/2.5";

// Demo data for fallback when API key is invalid
const DEMO_WEATHER = {
  name: "Demo City",
  sys: { country: "US" },
  main: {
    temp: 22,
    feels_like: 25,
    humidity: 65,
    pressure: 1013,
  },
  weather: [
    {
      main: "Clear",
      description: "clear sky",
      icon: "01d",
    },
  ],
  wind: { speed: 3.5 },
  visibility: 10000,
};

const DEMO_FORECAST = [
  {
    dt_txt: "2024-01-15 12:00:00",
    main: { temp: 22, temp_min: 18 },
    weather: [{ icon: "01d" }],
  },
  {
    dt_txt: "2024-01-16 12:00:00",
    main: { temp: 25, temp_min: 20 },
    weather: [{ icon: "02d" }],
  },
  {
    dt_txt: "2024-01-17 12:00:00",
    main: { temp: 19, temp_min: 15 },
    weather: [{ icon: "03d" }],
  },
  {
    dt_txt: "2024-01-18 12:00:00",
    main: { temp: 23, temp_min: 19 },
    weather: [{ icon: "01d" }],
  },
  {
    dt_txt: "2024-01-19 12:00:00",
    main: { temp: 21, temp_min: 17 },
    weather: [{ icon: "04d" }],
  },
];

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState("");
  const [defaultLocation, setDefaultLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      setTime(timeString);
      setDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user exact location and fetch weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude, true);
        },
        () => {
          // Default to New York if location access denied
          fetchWeatherByCity("New York", true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 },
      );
    } else {
      fetchWeatherByCity("New York", true);
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon, isDefault = false) => {
    try {
      setLoading(true);

      // Current weather
      const weatherResponse = await fetch(
        `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          throw new Error(
            "Invalid API key. Please check your OpenWeatherMap API key.",
          );
        }
        throw new Error(
          `Weather API error: ${weatherResponse.status} - ${weatherResponse.statusText}`,
        );
      }

      const weatherData = await weatherResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );

      if (!forecastResponse.ok) {
        if (forecastResponse.status === 401) {
          throw new Error(
            "Invalid API key. Please check your OpenWeatherMap API key.",
          );
        }
        throw new Error(
          `Forecast API error: ${forecastResponse.status} - ${forecastResponse.statusText}`,
        );
      }

      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      const locationName = `${weatherData.name}, ${weatherData.sys.country}`;
      setLocation(locationName);

      if (isDefault) {
        setDefaultLocation(locationName);
      }

      // Process forecast data (take one per day)
      const dailyForecast = forecastData.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5);
      setForecast(dailyForecast);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);

      // Use demo data if API key is invalid
      if (error.message.includes("Invalid API key")) {
        setWeather(DEMO_WEATHER);
        setLocation("Demo City, US (API Key Invalid)");
        if (isDefault) {
          setDefaultLocation("Demo City, US (API Key Invalid)");
        }
        setForecast(DEMO_FORECAST);
      }

      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city, isDefault = false) => {
    try {
      setLoading(true);

      const weatherResponse = await fetch(
        `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          throw new Error(
            "Invalid API key. Please check your OpenWeatherMap API key.",
          );
        }
        throw new Error(
          `Weather API error: ${weatherResponse.status} - ${weatherResponse.statusText}`,
        );
      }

      const weatherData = await weatherResponse.json();

      const forecastResponse = await fetch(
        `${API_BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );

      if (!forecastResponse.ok) {
        if (forecastResponse.status === 401) {
          throw new Error(
            "Invalid API key. Please check your OpenWeatherMap API key.",
          );
        }
        throw new Error(
          `Forecast API error: ${forecastResponse.status} - ${forecastResponse.statusText}`,
        );
      }

      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      const locationName = `${weatherData.name}, ${weatherData.sys.country}`;
      setLocation(locationName);

      if (isDefault) {
        setDefaultLocation(locationName);
      }

      const dailyForecast = forecastData.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5);
      setForecast(dailyForecast);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);

      // Use demo data if API key is invalid
      if (error.message.includes("Invalid API key")) {
        setWeather(DEMO_WEATHER);
        setLocation("Demo City, US (API Key Invalid)");
        if (isDefault) {
          setDefaultLocation("Demo City, US (API Key Invalid)");
        }
        setForecast(DEMO_FORECAST);
      }

      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const city = e.target.city.value.trim();
    if (city) {
      setIsSearching(true);
      fetchWeatherByCity(city);
      e.target.city.value = "";
    }
  };

  const handleBackToDefault = () => {
    setIsSearching(false);
    setLocation(defaultLocation);
    // Fetch weather for default location again
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          fetchWeatherByCity("New York");
        },
      );
    } else {
      fetchWeatherByCity("New York");
    }
  };

  const getWeatherIcon = (iconCode) => {
    // Map weather codes to realistic icons
    const iconMap = {
      "01d": "☀️", // clear sky day
      "01n": "🌙", // clear sky night
      "02d": "⛅", // few clouds day
      "02n": "☁️", // few clouds night
      "03d": "☁️", // scattered clouds
      "03n": "☁️", // scattered clouds
      "04d": "☁️", // broken clouds
      "04n": "☁️", // broken clouds
      "09d": "🌧️", // shower rain
      "09n": "🌧️", // shower rain
      "10d": "🌦️", // rain day
      "10n": "🌧️", // rain night
      "11d": "⛈️", // thunderstorm
      "11n": "⛈️", // thunderstorm
      "13d": "🌨️", // snow
      "13n": "🌨️", // snow
      "50d": "🌫️", // mist
      "50n": "🌫️", // mist
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
          <p className="loading-text">Getting your weather...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-app">
        <div className="error-container">
          <p className="error-text">Unable to load weather data</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-app">
      <div className="weather-container">
        {/* Header with Time and Location */}
        <header className="header">
          <div className="time-date">
            <h1 className="current-time">{time}</h1>
            <p className="current-date">{date}</p>
          </div>
          <div className="location-section">
            {isSearching && (
              <button onClick={handleBackToDefault} className="back-btn">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <h2 className="location">{location.split(",")[0]}</h2>
          </div>
        </header>

        {/* Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            name="city"
            placeholder="Search for a city..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>

        {/* Main Content */}
        <div className="main-content">
          {/* Current Weather */}
          <div className="current-weather">
            <div className="weather-icon-main">
              <span className="icon">
                {getWeatherIcon(weather.weather[0].icon)}
              </span>
            </div>
            <div className="temperature-section">
              <span className="temperature">
                {Math.round(weather.main.temp)}°
              </span>
              <div className="weather-info">
                <h3 className="weather-condition">{weather.weather[0].main}</h3>
                <p className="feels-like">
                  Feels like {Math.round(weather.main.feels_like)}°
                </p>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-icon">🌬️</span>
              <div className="detail-info">
                <span className="detail-label">Wind</span>
                <span className="detail-value">{weather.wind.speed} m/s</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <div className="detail-info">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.main.humidity}%</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">👀</span>
              <div className="detail-info">
                <span className="detail-label">Visibility</span>
                <span className="detail-value">
                  {Math.round(weather.visibility / 1000)} km
                </span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🌡️</span>
              <div className="detail-info">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">
                  {weather.main.pressure} hPa
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="forecast-section">
            <h3 className="forecast-title">5-Day Forecast</h3>
            <div className="forecast-list">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-item">
                  <span className="forecast-day">
                    {index === 0 ? "Today" : getDayName(day.dt_txt)}
                  </span>
                  <span className="forecast-icon">
                    {getWeatherIcon(day.weather[0].icon)}
                  </span>
                  <span className="forecast-temp">
                    {Math.round(day.main.temp)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
