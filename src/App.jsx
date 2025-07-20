import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_KEY = "9d115f522095a9e57da470ddda5386a4";
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const GEODB_API =
  "https://geodb-free-service.wirefreethought.com/v1/geo/cities";

// Enhanced local cities database with country flags
const LOCAL_CITIES = [
  {
    name: "New York",
    region: "New York",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Los Angeles",
    region: "California",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    name: "Chicago",
    region: "Illinois",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    name: "Houston",
    region: "Texas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 29.7604,
    longitude: -95.3698,
  },
  {
    name: "Phoenix",
    region: "Arizona",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 33.4484,
    longitude: -112.074,
  },
  {
    name: "Philadelphia",
    region: "Pennsylvania",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 39.9526,
    longitude: -75.1652,
  },
  {
    name: "San Antonio",
    region: "Texas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 29.4241,
    longitude: -98.4936,
  },
  {
    name: "San Diego",
    region: "California",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 32.7157,
    longitude: -117.1611,
  },
  {
    name: "Dallas",
    region: "Texas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 32.7767,
    longitude: -96.797,
  },
  {
    name: "San Jose",
    region: "California",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 37.3382,
    longitude: -121.8863,
  },
  {
    name: "Austin",
    region: "Texas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 30.2672,
    longitude: -97.7431,
  },
  {
    name: "Jacksonville",
    region: "Florida",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 30.3322,
    longitude: -81.6557,
  },
  {
    name: "San Francisco",
    region: "California",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    name: "Indianapolis",
    region: "Indiana",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 39.7684,
    longitude: -86.1581,
  },
  {
    name: "Columbus",
    region: "Ohio",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 39.9612,
    longitude: -82.9988,
  },
  {
    name: "Fort Worth",
    region: "Texas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 32.7555,
    longitude: -97.3308,
  },
  {
    name: "Charlotte",
    region: "North Carolina",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 35.2271,
    longitude: -80.8431,
  },
  {
    name: "Seattle",
    region: "Washington",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 47.6062,
    longitude: -122.3321,
  },
  {
    name: "Denver",
    region: "Colorado",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 39.7392,
    longitude: -104.9903,
  },
  {
    name: "Washington",
    region: "District of Columbia",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 38.9072,
    longitude: -77.0369,
  },
  {
    name: "Boston",
    region: "Massachusetts",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    name: "Nashville",
    region: "Tennessee",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 36.1627,
    longitude: -86.7816,
  },
  {
    name: "Miami",
    region: "Florida",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    name: "Las Vegas",
    region: "Nevada",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 36.1699,
    longitude: -115.1398,
  },
  {
    name: "Atlanta",
    region: "Georgia",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    latitude: 33.749,
    longitude: -84.388,
  },

  // Canadian Cities
  {
    name: "Toronto",
    region: "Ontario",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 43.6532,
    longitude: -79.3832,
  },
  {
    name: "Montreal",
    region: "Quebec",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 45.5017,
    longitude: -73.5673,
  },
  {
    name: "Vancouver",
    region: "British Columbia",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 49.2827,
    longitude: -123.1207,
  },
  {
    name: "Calgary",
    region: "Alberta",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 51.0447,
    longitude: -114.0719,
  },
  {
    name: "Edmonton",
    region: "Alberta",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 53.5461,
    longitude: -113.4938,
  },
  {
    name: "Ottawa",
    region: "Ontario",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 45.4215,
    longitude: -75.6972,
  },
  {
    name: "Winnipeg",
    region: "Manitoba",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 49.8951,
    longitude: -97.1384,
  },
  {
    name: "Quebec City",
    region: "Quebec",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    latitude: 46.8139,
    longitude: -71.208,
  },

  // European Cities
  {
    name: "London",
    region: "England",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: "Paris",
    region: "Île-de-France",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    name: "Berlin",
    region: "Berlin",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    latitude: 52.52,
    longitude: 13.405,
  },
  {
    name: "Madrid",
    region: "Community of Madrid",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    name: "Rome",
    region: "Lazio",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    name: "Amsterdam",
    region: "North Holland",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    name: "Vienna",
    region: "Vienna",
    country: "Austria",
    countryCode: "AT",
    flag: "🇦🇹",
    latitude: 48.2082,
    longitude: 16.3738,
  },
  {
    name: "Stockholm",
    region: "Stockholm County",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    latitude: 59.3293,
    longitude: 18.0686,
  },
  {
    name: "Copenhagen",
    region: "Capital Region",
    country: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
    latitude: 55.6761,
    longitude: 12.5683,
  },
  {
    name: "Helsinki",
    region: "Uusimaa",
    country: "Finland",
    countryCode: "FI",
    flag: "🇫🇮",
    latitude: 60.1699,
    longitude: 24.9384,
  },
  {
    name: "Oslo",
    region: "Oslo",
    country: "Norway",
    countryCode: "NO",
    flag: "🇳🇴",
    latitude: 59.9139,
    longitude: 10.7522,
  },
  {
    name: "Warsaw",
    region: "Masovian Voivodeship",
    country: "Poland",
    countryCode: "PL",
    flag: "🇵🇱",
    latitude: 52.2297,
    longitude: 21.0122,
  },
  {
    name: "Prague",
    region: "Prague",
    country: "Czech Republic",
    countryCode: "CZ",
    flag: "🇨🇿",
    latitude: 50.0755,
    longitude: 14.4378,
  },
  {
    name: "Budapest",
    region: "Budapest",
    country: "Hungary",
    countryCode: "HU",
    flag: "🇭🇺",
    latitude: 47.4979,
    longitude: 19.0402,
  },
  {
    name: "Brussels",
    region: "Brussels-Capital Region",
    country: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
    latitude: 50.8503,
    longitude: 4.3517,
  },
  {
    name: "Zurich",
    region: "Zurich",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
    latitude: 47.3769,
    longitude: 8.5417,
  },
  {
    name: "Barcelona",
    region: "Catalonia",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    latitude: 41.3851,
    longitude: 2.1734,
  },
  {
    name: "Munich",
    region: "Bavaria",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    latitude: 48.1351,
    longitude: 11.582,
  },
  {
    name: "Milan",
    region: "Lombardy",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    latitude: 45.4642,
    longitude: 9.19,
  },

  // Asian Cities
  {
    name: "Tokyo",
    region: "Kantō",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    name: "Delhi",
    region: "Delhi",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    latitude: 28.7041,
    longitude: 77.1025,
  },
  {
    name: "Shanghai",
    region: "Shanghai",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    latitude: 31.2304,
    longitude: 121.4737,
  },
  {
    name: "Mumbai",
    region: "Maharashtra",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    name: "Beijing",
    region: "Beijing",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    name: "Osaka",
    region: "Kansai",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    latitude: 34.6937,
    longitude: 135.5023,
  },
  {
    name: "Seoul",
    region: "Seoul Capital Area",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    name: "Bangkok",
    region: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    flag: "🇹🇭",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    name: "Singapore",
    region: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    latitude: 1.3521,
    longitude: 103.8198,
  },
  {
    name: "Hong Kong",
    region: "Hong Kong",
    country: "Hong Kong",
    countryCode: "HK",
    flag: "🇭🇰",
    latitude: 22.3193,
    longitude: 114.1694,
  },
  {
    name: "Kuala Lumpur",
    region: "Federal Territory",
    country: "Malaysia",
    countryCode: "MY",
    flag: "🇲🇾",
    latitude: 3.139,
    longitude: 101.6869,
  },
  {
    name: "Jakarta",
    region: "Jakarta",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    latitude: -6.2088,
    longitude: 106.8456,
  },
  {
    name: "Manila",
    region: "Metro Manila",
    country: "Philippines",
    countryCode: "PH",
    flag: "🇵🇭",
    latitude: 14.5995,
    longitude: 120.9842,
  },
  {
    name: "Taipei",
    region: "Taipei",
    country: "Taiwan",
    countryCode: "TW",
    flag: "🇹🇼",
    latitude: 25.033,
    longitude: 121.5654,
  },

  // Middle Eastern Cities
  {
    name: "Dubai",
    region: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    latitude: 25.2048,
    longitude: 55.2708,
  },
  {
    name: "Riyadh",
    region: "Riyadh Province",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    latitude: 24.7136,
    longitude: 46.6753,
  },
  {
    name: "Tehran",
    region: "Tehran",
    country: "Iran",
    countryCode: "IR",
    flag: "🇮🇷",
    latitude: 35.6892,
    longitude: 51.389,
  },
  {
    name: "Istanbul",
    region: "Istanbul",
    country: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    latitude: 41.0082,
    longitude: 28.9784,
  },
  {
    name: "Kuwait City",
    region: "Al Asimah",
    country: "Kuwait",
    countryCode: "KW",
    flag: "🇰🇼",
    latitude: 29.3759,
    longitude: 47.9774,
  },
  {
    name: "Abu Dhabi",
    region: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    latitude: 24.2539,
    longitude: 54.3773,
  },
  {
    name: "Doha",
    region: "Doha",
    country: "Qatar",
    countryCode: "QA",
    flag: "🇶🇦",
    latitude: 25.2854,
    longitude: 51.531,
  },

  // African Cities
  {
    name: "Cairo",
    region: "Cairo Governorate",
    country: "Egypt",
    countryCode: "EG",
    flag: "🇪🇬",
    latitude: 30.0444,
    longitude: 31.2357,
  },
  {
    name: "Lagos",
    region: "Lagos State",
    country: "Nigeria",
    countryCode: "NG",
    flag: "🇳🇬",
    latitude: 6.5244,
    longitude: 3.3792,
  },
  {
    name: "Johannesburg",
    region: "Gauteng",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    latitude: -26.2041,
    longitude: 28.0473,
  },
  {
    name: "Casablanca",
    region: "Casablanca-Settat",
    country: "Morocco",
    countryCode: "MA",
    flag: "🇲🇦",
    latitude: 33.5731,
    longitude: -7.5898,
  },
  {
    name: "Cape Town",
    region: "Western Cape",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    latitude: -33.9249,
    longitude: 18.4241,
  },
  {
    name: "Nairobi",
    region: "Nairobi County",
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    latitude: -1.2921,
    longitude: 36.8219,
  },
  {
    name: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    countryCode: "GH",
    flag: "🇬🇭",
    latitude: 5.6037,
    longitude: -0.187,
  },

  // South American Cities
  {
    name: "São Paulo",
    region: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    name: "Lima",
    region: "Lima Province",
    country: "Peru",
    countryCode: "PE",
    flag: "🇵🇪",
    latitude: -12.0464,
    longitude: -77.0428,
  },
  {
    name: "Bogotá",
    region: "Capital District",
    country: "Colombia",
    countryCode: "CO",
    flag: "🇨🇴",
    latitude: 4.711,
    longitude: -74.0721,
  },
  {
    name: "Rio de Janeiro",
    region: "Rio de Janeiro",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    latitude: -22.9068,
    longitude: -43.1729,
  },
  {
    name: "Santiago",
    region: "Santiago Metropolitan",
    country: "Chile",
    countryCode: "CL",
    flag: "🇨🇱",
    latitude: -33.4489,
    longitude: -70.6693,
  },
  {
    name: "Buenos Aires",
    region: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    flag: "🇦🇷",
    latitude: -34.6118,
    longitude: -58.396,
  },
  {
    name: "Caracas",
    region: "Capital District",
    country: "Venezuela",
    countryCode: "VE",
    flag: "🇻🇪",
    latitude: 10.4806,
    longitude: -66.9036,
  },

  // Oceania Cities
  {
    name: "Sydney",
    region: "New South Wales",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    name: "Melbourne",
    region: "Victoria",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  {
    name: "Brisbane",
    region: "Queensland",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    latitude: -27.4705,
    longitude: 153.026,
  },
  {
    name: "Perth",
    region: "Western Australia",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    latitude: -31.9505,
    longitude: 115.8605,
  },
  {
    name: "Auckland",
    region: "Auckland Region",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    latitude: -36.8485,
    longitude: 174.7633,
  },
  {
    name: "Wellington",
    region: "Wellington Region",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    latitude: -41.2924,
    longitude: 174.7787,
  },
];

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [savedCities, setSavedCities] = useState([]);
  const [autoTheme, setAutoTheme] = useState(true);

  // Update current time and auto theme
  useEffect(() => {
    const updateTimeAndTheme = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );

      // Auto theme based on time of day
      if (autoTheme) {
        const hour = now.getHours();
        if (hour >= 6 && hour < 18) {
          setIsDarkMode(false); // Light mode during day
        } else {
          setIsDarkMode(true); // Dark mode during night
        }
      }
    };

    updateTimeAndTheme();
    const interval = setInterval(updateTimeAndTheme, 1000);
    return () => clearInterval(interval);
  }, [autoTheme]);

  // Load saved cities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedCities");
    if (saved) {
      setSavedCities(JSON.parse(saved));
    }
  }, []);

  // Save cities to localStorage
  useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }, [savedCities]);

  // Get user's current location on app load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          // Default to New York if location access denied
          const defaultCity = LOCAL_CITIES.find(
            (city) => city.name === "New York",
          );
          if (defaultCity) {
            handleCitySelect(defaultCity);
          }
        },
      );
    }
  }, []);

  // Enhanced city search with GeoDB API fallback
  const searchCities = useCallback(async (query) => {
    if (query.length < 2) {
      setCityResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchLoading(true);

    // Try GeoDB API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `${GEODB_API}?limit=10&namePrefix=${encodeURIComponent(query)}`,
        {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        },
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const enhancedResults = data.data.map((city) => ({
            ...city,
            flag: getCountryFlag(city.countryCode),
          }));
          setCityResults(enhancedResults);
          setShowDropdown(true);
          setSearchLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log("GeoDB API not available, using local database");
    }

    // Fallback to local database
    const filtered = LOCAL_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.region?.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase()),
    );

    const results = filtered.slice(0, 10).map((city, index) => ({
      ...city,
      id: `local-${index}`,
    }));

    setCityResults(results);
    setShowDropdown(results.length > 0);
    setSearchLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCities(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchCities]);

  // Get country flag emoji
  const getCountryFlag = (countryCode) => {
    const flagMap = {
      US: "🇺🇸",
      CA: "🇨🇦",
      GB: "🇬🇧",
      FR: "🇫🇷",
      DE: "🇩🇪",
      ES: "🇪🇸",
      IT: "🇮🇹",
      NL: "🇳🇱",
      AT: "🇦🇹",
      SE: "🇸🇪",
      DK: "🇩🇰",
      FI: "🇫🇮",
      NO: "🇳🇴",
      PL: "🇵🇱",
      CZ: "🇨🇿",
      HU: "🇭🇺",
      BE: "🇧🇪",
      CH: "🇨🇭",
      JP: "🇯🇵",
      CN: "🇨🇳",
      IN: "🇮🇳",
      KR: "🇰🇷",
      TH: "🇹🇭",
      SG: "🇸🇬",
      HK: "🇭🇰",
      MY: "🇲🇾",
      ID: "🇮🇩",
      PH: "🇵🇭",
      TW: "🇹🇼",
      AE: "🇦🇪",
      SA: "🇸🇦",
      IR: "🇮🇷",
      TR: "🇹🇷",
      KW: "🇰🇼",
      QA: "🇶🇦",
      EG: "🇪🇬",
      NG: "🇳🇬",
      ZA: "🇿🇦",
      MA: "🇲🇦",
      KE: "🇰🇪",
      GH: "🇬🇭",
      BR: "🇧🇷",
      PE: "🇵🇪",
      CO: "🇨🇴",
      CL: "🇨🇱",
      AR: "🇦🇷",
      VE: "🇻🇪",
      AU: "🇦🇺",
      NZ: "🇳🇿",
    };
    return flagMap[countryCode] || "🌍";
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        `${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        { signal: controller.signal },
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setSelectedCity({
          name: data.name,
          country: data.sys.country,
          countryCode: data.sys.country,
          flag: getCountryFlag(data.sys.country),
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
    setLoading(false);
  };

  // Fetch weather by city
  const fetchWeatherByCity = async (cityName, countryCode) => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const query = countryCode ? `${cityName},${countryCode}` : cityName;
      const response = await fetch(
        `${WEATHER_API}?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`,
        { signal: controller.signal },
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setSelectedCity({
          name: data.name,
          country: data.sys.country,
          countryCode: data.sys.country,
          flag: getCountryFlag(data.sys.country),
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
    setLoading(false);
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setSearchQuery("");
    setShowDropdown(false);
    setCityResults([]);
    fetchWeatherByCity(city.name, city.countryCode);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (cityResults.length > 0) {
      handleCitySelect(cityResults[0]);
    }
  };

  // Save/unsave city
  const toggleSaveCity = (city) => {
    const isAlreadySaved = savedCities.some(
      (saved) =>
        saved.name === city.name && saved.countryCode === city.countryCode,
    );

    if (isAlreadySaved) {
      setSavedCities(
        savedCities.filter(
          (saved) =>
            !(
              saved.name === city.name && saved.countryCode === city.countryCode
            ),
        ),
      );
    } else {
      setSavedCities([...savedCities, city]);
    }
  };

  // Check if city is saved
  const isCitySaved = (city) => {
    return savedCities.some(
      (saved) =>
        saved.name === city.name && saved.countryCode === city.countryCode,
    );
  };

  // Get premium weather icon
  const getWeatherIcon = (condition, iconCode) => {
    const iconMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "🌤️",
      "02n": "☁️",
      "03d": "⛅",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌦️",
      "09n": "🌧️",
      "10d": "🌧️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "🌨️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return iconMap[iconCode] || "🌤️";
  };

  // Get weather-based background gradient
  const getWeatherGradient = (condition) => {
    const gradients = {
      clear: isDarkMode
        ? "from-indigo-900 via-purple-900 to-pink-800"
        : "from-yellow-400 via-orange-400 to-red-400",
      clouds: isDarkMode
        ? "from-gray-700 via-gray-800 to-gray-900"
        : "from-gray-300 via-gray-400 to-gray-500",
      rain: isDarkMode
        ? "from-blue-900 via-indigo-900 to-purple-900"
        : "from-blue-400 via-blue-500 to-blue-600",
      thunderstorm: isDarkMode
        ? "from-purple-900 via-gray-900 to-black"
        : "from-purple-600 via-gray-700 to-gray-800",
      snow: isDarkMode
        ? "from-blue-800 via-indigo-800 to-purple-800"
        : "from-blue-100 via-white to-gray-200",
      mist: isDarkMode
        ? "from-gray-600 via-gray-700 to-gray-800"
        : "from-gray-200 via-gray-300 to-gray-400",
    };

    return (
      gradients[condition?.toLowerCase()] ||
      (isDarkMode
        ? "from-cyan-900 via-blue-900 to-indigo-900"
        : "from-cyan-400 via-blue-500 to-indigo-600")
    );
  };

  return (
    <div
      className={`app ${isDarkMode ? "dark" : "light"} ${weather ? getWeatherGradient(weather.weather[0].main) : isDarkMode ? "from-cyan-900 via-blue-900 to-indigo-900" : "from-cyan-400 via-blue-500 to-indigo-600"}`}
    >
      {/* Theme Controls */}
      <div className="theme-controls">
        <button
          onClick={() => setAutoTheme(!autoTheme)}
          className={`theme-btn ${autoTheme ? "active" : ""}`}
          title="Auto Theme"
        >
          🌗
        </button>
        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
            setAutoTheme(false);
          }}
          className="theme-btn"
          title="Toggle Theme"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="container">
        {/* Sticky Weather Bar */}
        {weather && selectedCity && (
          <div className="sticky-weather-bar">
            <div className="sticky-weather-content">
              <div className="sticky-location">
                <span className="sticky-flag">{selectedCity.flag}</span>
                <span className="sticky-city">{selectedCity.name}</span>
                <span className="sticky-temp">
                  {Math.round(weather.main.temp)}°
                </span>
              </div>
              <div className="sticky-time">{currentTime}</div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Weather Nexus</h1>
            <p className="hero-subtitle">
              Premium weather insights for every corner of the world
            </p>
            <div className="hero-time">
              <div className="time-display">{currentTime}</div>
              <div className="date-display">{currentDate}</div>
            </div>
          </div>
        </header>

        {/* Premium Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-container">
              <div className="search-input-wrapper">
                <div className="search-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cities, countries, or regions..."
                  className="search-input"
                  autoComplete="off"
                />
                {searchLoading && (
                  <div className="search-spinner">
                    <div className="spinner-premium"></div>
                  </div>
                )}
              </div>

              {/* Enhanced Dropdown */}
              {showDropdown && cityResults.length > 0 && (
                <div className="dropdown-premium">
                  {cityResults.map((city, index) => (
                    <div
                      key={city.id || `${city.name}-${index}`}
                      className="dropdown-item-premium"
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="city-flag">{city.flag}</div>
                      <div className="city-info-premium">
                        <div className="city-name-premium">{city.name}</div>
                        <div className="city-details-premium">
                          {city.region && `${city.region}, `}
                          {city.country}
                        </div>
                      </div>
                      <div className="city-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveCity(city);
                          }}
                          className={`save-btn ${isCitySaved(city) ? "saved" : ""}`}
                        >
                          {isCitySaved(city) ? "❤️" : "🤍"}
                        </button>
                        <svg
                          className="arrow-icon-premium"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Saved Cities */}
        {savedCities.length > 0 && (
          <div className="saved-cities-section">
            <h3 className="saved-cities-title">Saved Cities</h3>
            <div className="saved-cities-grid">
              {savedCities.map((city, index) => (
                <button
                  key={`${city.name}-${city.countryCode}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  className="saved-city-card"
                >
                  <span className="saved-city-flag">{city.flag}</span>
                  <span className="saved-city-name">{city.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveCity(city);
                    }}
                    className="remove-saved-btn"
                  >
                    ×
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-section-premium">
            <div className="loading-spinner-premium">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text-premium">Fetching weather data...</p>
          </div>
        )}

        {/* Premium Weather Display */}
        {weather && !loading && (
          <div className="weather-section-premium">
            <div className="weather-card-premium">
              {/* Weather Header */}
              <div className="weather-header-premium">
                <div className="location-premium">
                  <span className="location-flag">{selectedCity?.flag}</span>
                  <div className="location-text">
                    <h2 className="location-name-premium">{weather.name}</h2>
                    <p className="location-country">{weather.sys.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => selectedCity && toggleSaveCity(selectedCity)}
                  className={`save-location-btn ${selectedCity && isCitySaved(selectedCity) ? "saved" : ""}`}
                >
                  {selectedCity && isCitySaved(selectedCity) ? "❤️" : "🤍"}
                </button>
              </div>

              {/* Main Weather Info */}
              <div className="weather-main-premium">
                <div className="weather-icon-premium">
                  <div className="icon-container">
                    {getWeatherIcon(
                      weather.weather[0].main,
                      weather.weather[0].icon,
                    )}
                  </div>
                  <div className="weather-description-premium">
                    <h3 className="condition-premium">
                      {weather.weather[0].main}
                    </h3>
                    <p className="description-premium">
                      {weather.weather[0].description}
                    </p>
                  </div>
                </div>

                <div className="temperature-premium">
                  <div className="temp-main">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <div className="temp-unit">Celsius</div>
                  <div className="feels-like-premium">
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>
              </div>

              {/* Weather Stats Grid */}
              <div className="weather-stats-premium">
                <div className="stat-card-premium">
                  <div className="stat-icon-premium">💨</div>
                  <div className="stat-content">
                    <span className="stat-label-premium">Wind Speed</span>
                    <span className="stat-value-premium">
                      {weather.wind.speed} m/s
                    </span>
                  </div>
                </div>

                <div className="stat-card-premium">
                  <div className="stat-icon-premium">💧</div>
                  <div className="stat-content">
                    <span className="stat-label-premium">Humidity</span>
                    <span className="stat-value-premium">
                      {weather.main.humidity}%
                    </span>
                  </div>
                </div>

                <div className="stat-card-premium">
                  <div className="stat-icon-premium">🌡️</div>
                  <div className="stat-content">
                    <span className="stat-label-premium">Pressure</span>
                    <span className="stat-value-premium">
                      {weather.main.pressure} hPa
                    </span>
                  </div>
                </div>

                <div className="stat-card-premium">
                  <div className="stat-icon-premium">👁️</div>
                  <div className="stat-content">
                    <span className="stat-label-premium">Visibility</span>
                    <span className="stat-value-premium">
                      {Math.round(weather.visibility / 1000)} km
                    </span>
                  </div>
                </div>
              </div>

              {/* Temperature Range */}
              <div className="temp-range-premium">
                <div className="temp-range-item">
                  <span className="temp-range-label">Today's Low</span>
                  <span className="temp-range-value">
                    {Math.round(weather.main.temp_min)}°
                  </span>
                </div>
                <div className="temp-range-divider"></div>
                <div className="temp-range-item">
                  <span className="temp-range-label">Today's High</span>
                  <span className="temp-range-value">
                    {Math.round(weather.main.temp_max)}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !loading && (
          <div className="empty-state-premium">
            <div className="empty-icon-premium">🌍</div>
            <h3 className="empty-title-premium">Discover Weather Worldwide</h3>
            <p className="empty-description-premium">
              Search for any city to get detailed weather information and local
              time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
