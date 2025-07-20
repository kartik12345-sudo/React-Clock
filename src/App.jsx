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
  const [loading, setLoading] = useState(true);
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
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setTime(timeString);
      setDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user location and fetch weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          // Default to New York if location access denied
          fetchWeatherByCity("New York");
        },
      );
    } else {
      fetchWeatherByCity("New York");
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
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
      setLocation(`${weatherData.name}, ${weatherData.sys.country}`);

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
        setForecast(DEMO_FORECAST);
      }

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
      setLocation(`${weatherData.name}, ${weatherData.sys.country}`);

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
        setForecast(DEMO_FORECAST);
      }

      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const city = e.target.city.value.trim();
    if (city) {
      fetchWeatherByCity(city);
      e.target.city.value = "";
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
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-app">
        <div className="error">
          <p>Unable to load weather data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-app">
      <div className="weather-container">
        {/* Header */}
        <header className="app-header">
          <div className="location-info">
            <h1 className="location">{location}</h1>
            <p className="current-date">{date}</p>
          </div>
          <div className="current-time">{time}</div>
        </header>

        {/* Search */}
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

        {/* Main Weather Card */}
        <div className="main-weather-card">
          <div className="main-weather-info">
            <div className="weather-icon-main">
              <span style={{ fontSize: "60px" }}>
                {getWeatherIcon(weather.weather[0].icon)}
              </span>
            </div>
            <div className="temperature-main">
              <span className="temp-value">
                {Math.round(weather.main.temp)}
              </span>
              <span className="temp-unit">°C</span>
            </div>
          </div>
          <div className="weather-details">
            <h3 className="weather-condition">{weather.weather[0].main}</h3>
            <p className="weather-description">
              {weather.weather[0].description}
            </p>
            <div className="feels-like">
              Feels like {Math.round(weather.main.feels_like)}°C
            </div>
          </div>
        </div>

        {/* Weather Stats */}
        <div className="weather-stats">
          <div className="stat-item">
            <div className="stat-icon">🌬️</div>
            <div className="stat-info">
              <span className="stat-label">Wind</span>
              <span className="stat-value">{weather.wind.speed} m/s</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💧</div>
            <div className="stat-info">
              <span className="stat-label">Humidity</span>
              <span className="stat-value">{weather.main.humidity}%</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👀</div>
            <div className="stat-info">
              <span className="stat-label">Visibility</span>
              <span className="stat-value">{weather.visibility / 1000} km</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🌡️</div>
            <div className="stat-info">
              <span className="stat-label">Pressure</span>
              <span className="stat-value">{weather.main.pressure} hPa</span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="forecast-section">
          <h3 className="forecast-title">5-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-day">
                  {index === 0 ? "Today" : getDayName(day.dt_txt)}
                </div>
                <div className="forecast-icon">
                  <span style={{ fontSize: "28px" }}>
                    {getWeatherIcon(day.weather[0].icon)}
                  </span>
                </div>
                <div className="forecast-temps">
                  <span className="forecast-high">
                    {Math.round(day.main.temp)}°
                  </span>
                  <span className="forecast-low">
                    {Math.round(day.main.temp_min)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
