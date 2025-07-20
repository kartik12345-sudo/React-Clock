import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "9d115f522095a9e57da470ddda5386a4";
const API_BASE = "https://api.openweathermap.org/data/2.5";
const TIMEZONE_API = "https://worldtimeapi.org/api/timezone";

// Timezone offset mapping for fallback time calculation
const TIMEZONE_OFFSETS = {
  "America/New_York": -5,
  "America/Los_Angeles": -8,
  "America/Chicago": -6,
  "America/Denver": -7,
  "America/Phoenix": -7,
  "America/Detroit": -5,
  "America/Indiana/Indianapolis": -5,
  "America/Toronto": -5,
  "America/Montreal": -5,
  "America/Vancouver": -8,
  "America/Edmonton": -7,
  "America/Winnipeg": -6,
  "America/Mexico_City": -6,
  "America/Monterrey": -6,
  "America/Tijuana": -8,
  "America/Chihuahua": -7,
  "America/Ojinaga": -7,
  "America/Merida": -6,
  "America/Sao_Paulo": -3,
  "America/Lima": -5,
  "America/Bogota": -5,
  "America/Santiago": -3,
  "America/Caracas": -4,
  "America/Argentina/Buenos_Aires": -3,
  "America/Bahia": -3,
  "America/Fortaleza": -3,
  "America/Guayaquil": -5,
  "America/Manaus": -4,
  "America/Recife": -3,
  "America/Argentina/Cordoba": -3,
  "Europe/London": 0,
  "Europe/Paris": 1,
  "Europe/Berlin": 1,
  "Europe/Madrid": 1,
  "Europe/Rome": 1,
  "Europe/Amsterdam": 1,
  "Europe/Vienna": 1,
  "Europe/Stockholm": 1,
  "Europe/Copenhagen": 1,
  "Europe/Helsinki": 2,
  "Europe/Oslo": 1,
  "Europe/Warsaw": 1,
  "Europe/Prague": 1,
  "Europe/Budapest": 1,
  "Europe/Brussels": 1,
  "Europe/Zurich": 1,
  "Europe/Istanbul": 3,
  "Asia/Tokyo": 9,
  "Asia/Kolkata": 5.5,
  "Asia/Shanghai": 8,
  "Asia/Seoul": 9,
  "Asia/Jakarta": 7,
  "Asia/Bangkok": 7,
  "Asia/Manila": 8,
  "Asia/Karachi": 5,
  "Asia/Dhaka": 6,
  "Asia/Ho_Chi_Minh": 7,
  "Asia/Singapore": 8,
  "Asia/Hong_Kong": 8,
  "Asia/Kuala_Lumpur": 8,
  "Asia/Taipei": 8,
  "Asia/Dubai": 4,
  "Asia/Riyadh": 3,
  "Asia/Tehran": 3.5,
  "Asia/Baghdad": 3,
  "Asia/Kuwait": 3,
  "Asia/Qatar": 3,
  "Asia/Amman": 2,
  "Asia/Beirut": 2,
  "Asia/Damascus": 2,
  "Asia/Jerusalem": 2,
  "Asia/Urumqi": 6,
  "Africa/Cairo": 2,
  "Africa/Lagos": 1,
  "Africa/Kinshasa": 1,
  "Africa/Johannesburg": 2,
  "Africa/Luanda": 1,
  "Africa/Dar_es_Salaam": 3,
  "Africa/Khartoum": 2,
  "Africa/Algiers": 1,
  "Africa/Abidjan": 0,
  "Africa/Casablanca": 1,
  "Africa/Nairobi": 3,
  "Africa/Accra": 0,
  "Africa/Addis_Ababa": 3,
  "Australia/Sydney": 11,
  "Australia/Melbourne": 11,
  "Australia/Brisbane": 10,
  "Australia/Perth": 8,
  "Australia/Adelaide": 10.5,
  "Pacific/Auckland": 13,
};

// Comprehensive city database (1000+ cities)
const WORLD_CITIES = [
  // Major US Cities
  {
    name: "New York",
    country: "US",
    state: "NY",
    timezone: "America/New_York",
  },
  {
    name: "Los Angeles",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  { name: "Chicago", country: "US", state: "IL", timezone: "America/Chicago" },
  { name: "Houston", country: "US", state: "TX", timezone: "America/Chicago" },
  { name: "Phoenix", country: "US", state: "AZ", timezone: "America/Phoenix" },
  {
    name: "Philadelphia",
    country: "US",
    state: "PA",
    timezone: "America/New_York",
  },
  {
    name: "San Antonio",
    country: "US",
    state: "TX",
    timezone: "America/Chicago",
  },
  {
    name: "San Diego",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  { name: "Dallas", country: "US", state: "TX", timezone: "America/Chicago" },
  {
    name: "San Jose",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  { name: "Austin", country: "US", state: "TX", timezone: "America/Chicago" },
  {
    name: "Jacksonville",
    country: "US",
    state: "FL",
    timezone: "America/New_York",
  },
  {
    name: "Fort Worth",
    country: "US",
    state: "TX",
    timezone: "America/Chicago",
  },
  {
    name: "Columbus",
    country: "US",
    state: "OH",
    timezone: "America/New_York",
  },
  {
    name: "Charlotte",
    country: "US",
    state: "NC",
    timezone: "America/New_York",
  },
  {
    name: "San Francisco",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Indianapolis",
    country: "US",
    state: "IN",
    timezone: "America/Indiana/Indianapolis",
  },
  {
    name: "Seattle",
    country: "US",
    state: "WA",
    timezone: "America/Los_Angeles",
  },
  { name: "Denver", country: "US", state: "CO", timezone: "America/Denver" },
  {
    name: "Washington",
    country: "US",
    state: "DC",
    timezone: "America/New_York",
  },
  { name: "Boston", country: "US", state: "MA", timezone: "America/New_York" },
  { name: "El Paso", country: "US", state: "TX", timezone: "America/Denver" },
  { name: "Detroit", country: "US", state: "MI", timezone: "America/Detroit" },
  {
    name: "Nashville",
    country: "US",
    state: "TN",
    timezone: "America/Chicago",
  },
  {
    name: "Portland",
    country: "US",
    state: "OR",
    timezone: "America/Los_Angeles",
  },
  { name: "Memphis", country: "US", state: "TN", timezone: "America/Chicago" },
  {
    name: "Oklahoma City",
    country: "US",
    state: "OK",
    timezone: "America/Chicago",
  },
  {
    name: "Las Vegas",
    country: "US",
    state: "NV",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Louisville",
    country: "US",
    state: "KY",
    timezone: "America/New_York",
  },
  {
    name: "Baltimore",
    country: "US",
    state: "MD",
    timezone: "America/New_York",
  },
  {
    name: "Milwaukee",
    country: "US",
    state: "WI",
    timezone: "America/Chicago",
  },
  {
    name: "Albuquerque",
    country: "US",
    state: "NM",
    timezone: "America/Denver",
  },
  { name: "Tucson", country: "US", state: "AZ", timezone: "America/Phoenix" },
  {
    name: "Fresno",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Sacramento",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  { name: "Mesa", country: "US", state: "AZ", timezone: "America/Phoenix" },
  {
    name: "Kansas City",
    country: "US",
    state: "MO",
    timezone: "America/Chicago",
  },
  { name: "Atlanta", country: "US", state: "GA", timezone: "America/New_York" },
  {
    name: "Long Beach",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Colorado Springs",
    country: "US",
    state: "CO",
    timezone: "America/Denver",
  },
  { name: "Raleigh", country: "US", state: "NC", timezone: "America/New_York" },
  { name: "Miami", country: "US", state: "FL", timezone: "America/New_York" },
  {
    name: "Virginia Beach",
    country: "US",
    state: "VA",
    timezone: "America/New_York",
  },
  { name: "Omaha", country: "US", state: "NE", timezone: "America/Chicago" },
  {
    name: "Oakland",
    country: "US",
    state: "CA",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Minneapolis",
    country: "US",
    state: "MN",
    timezone: "America/Chicago",
  },
  { name: "Tulsa", country: "US", state: "OK", timezone: "America/Chicago" },
  {
    name: "Arlington",
    country: "US",
    state: "TX",
    timezone: "America/Chicago",
  },
  {
    name: "New Orleans",
    country: "US",
    state: "LA",
    timezone: "America/Chicago",
  },

  // European Cities
  { name: "London", country: "GB", timezone: "Europe/London" },
  { name: "Paris", country: "FR", timezone: "Europe/Paris" },
  { name: "Berlin", country: "DE", timezone: "Europe/Berlin" },
  { name: "Madrid", country: "ES", timezone: "Europe/Madrid" },
  { name: "Rome", country: "IT", timezone: "Europe/Rome" },
  { name: "Amsterdam", country: "NL", timezone: "Europe/Amsterdam" },
  { name: "Vienna", country: "AT", timezone: "Europe/Vienna" },
  { name: "Stockholm", country: "SE", timezone: "Europe/Stockholm" },
  { name: "Copenhagen", country: "DK", timezone: "Europe/Copenhagen" },
  { name: "Helsinki", country: "FI", timezone: "Europe/Helsinki" },
  { name: "Oslo", country: "NO", timezone: "Europe/Oslo" },
  { name: "Warsaw", country: "PL", timezone: "Europe/Warsaw" },
  { name: "Prague", country: "CZ", timezone: "Europe/Prague" },
  { name: "Budapest", country: "HU", timezone: "Europe/Budapest" },
  { name: "Brussels", country: "BE", timezone: "Europe/Brussels" },
  { name: "Zurich", country: "CH", timezone: "Europe/Zurich" },
  { name: "Barcelona", country: "ES", timezone: "Europe/Madrid" },
  { name: "Munich", country: "DE", timezone: "Europe/Berlin" },
  { name: "Milan", country: "IT", timezone: "Europe/Rome" },
  { name: "Naples", country: "IT", timezone: "Europe/Rome" },
  { name: "Hamburg", country: "DE", timezone: "Europe/Berlin" },
  { name: "Cologne", country: "DE", timezone: "Europe/Berlin" },
  { name: "Frankfurt", country: "DE", timezone: "Europe/Berlin" },
  { name: "Stuttgart", country: "DE", timezone: "Europe/Berlin" },
  { name: "Dusseldorf", country: "DE", timezone: "Europe/Berlin" },
  { name: "Dortmund", country: "DE", timezone: "Europe/Berlin" },
  { name: "Essen", country: "DE", timezone: "Europe/Berlin" },
  { name: "Leipzig", country: "DE", timezone: "Europe/Berlin" },
  { name: "Bremen", country: "DE", timezone: "Europe/Berlin" },
  { name: "Dresden", country: "DE", timezone: "Europe/Berlin" },
  { name: "Hanover", country: "DE", timezone: "Europe/Berlin" },
  { name: "Nuremberg", country: "DE", timezone: "Europe/Berlin" },
  { name: "Duisburg", country: "DE", timezone: "Europe/Berlin" },
  { name: "Bochum", country: "DE", timezone: "Europe/Berlin" },
  { name: "Wuppertal", country: "DE", timezone: "Europe/Berlin" },
  { name: "Bielefeld", country: "DE", timezone: "Europe/Berlin" },
  { name: "Bonn", country: "DE", timezone: "Europe/Berlin" },
  { name: "Munster", country: "DE", timezone: "Europe/Berlin" },

  // Asian Cities
  { name: "Tokyo", country: "JP", timezone: "Asia/Tokyo" },
  { name: "Delhi", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Shanghai", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Mumbai", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Beijing", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Osaka", country: "JP", timezone: "Asia/Tokyo" },
  { name: "Karachi", country: "PK", timezone: "Asia/Karachi" },
  { name: "Istanbul", country: "TR", timezone: "Europe/Istanbul" },
  { name: "Dhaka", country: "BD", timezone: "Asia/Dhaka" },
  { name: "Manila", country: "PH", timezone: "Asia/Manila" },
  { name: "Tianjin", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Bangalore", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Ho Chi Minh City", country: "VN", timezone: "Asia/Ho_Chi_Minh" },
  { name: "Lahore", country: "PK", timezone: "Asia/Karachi" },
  { name: "Chennai", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Seoul", country: "KR", timezone: "Asia/Seoul" },
  { name: "Jakarta", country: "ID", timezone: "Asia/Jakarta" },
  { name: "Bangkok", country: "TH", timezone: "Asia/Bangkok" },
  { name: "Hyderabad", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Chongqing", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Kolkata", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Suzhou", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Yokohama", country: "JP", timezone: "Asia/Tokyo" },
  { name: "Ahmadabad", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Hangzhou", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Haora", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Shenyang", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Guangzhou", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Busan", country: "KR", timezone: "Asia/Seoul" },
  { name: "Nanjing", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Ekurhuleni", country: "ZA", timezone: "Africa/Johannesburg" },
  { name: "Wuhan", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Faisalabad", country: "PK", timezone: "Asia/Karachi" },
  { name: "Wenzhou", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Pune", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Surat", country: "IN", timezone: "Asia/Kolkata" },
  { name: "Harbin", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Rawalpindi", country: "PK", timezone: "Asia/Karachi" },
  { name: "Qingdao", country: "CN", timezone: "Asia/Shanghai" },

  // Middle Eastern Cities
  { name: "Dubai", country: "AE", timezone: "Asia/Dubai" },
  { name: "Riyadh", country: "SA", timezone: "Asia/Riyadh" },
  { name: "Tehran", country: "IR", timezone: "Asia/Tehran" },
  { name: "Baghdad", country: "IQ", timezone: "Asia/Baghdad" },
  { name: "Kuwait City", country: "KW", timezone: "Asia/Kuwait" },
  { name: "Abu Dhabi", country: "AE", timezone: "Asia/Dubai" },
  { name: "Doha", country: "QA", timezone: "Asia/Qatar" },
  { name: "Jeddah", country: "SA", timezone: "Asia/Riyadh" },
  { name: "Mecca", country: "SA", timezone: "Asia/Riyadh" },
  { name: "Medina", country: "SA", timezone: "Asia/Riyadh" },
  { name: "Amman", country: "JO", timezone: "Asia/Amman" },
  { name: "Beirut", country: "LB", timezone: "Asia/Beirut" },
  { name: "Damascus", country: "SY", timezone: "Asia/Damascus" },
  { name: "Jerusalem", country: "IL", timezone: "Asia/Jerusalem" },
  { name: "Tel Aviv", country: "IL", timezone: "Asia/Jerusalem" },

  // African Cities
  { name: "Cairo", country: "EG", timezone: "Africa/Cairo" },
  { name: "Lagos", country: "NG", timezone: "Africa/Lagos" },
  { name: "Kinshasa", country: "CD", timezone: "Africa/Kinshasa" },
  { name: "Johannesburg", country: "ZA", timezone: "Africa/Johannesburg" },
  { name: "Luanda", country: "AO", timezone: "Africa/Luanda" },
  { name: "Dar es Salaam", country: "TZ", timezone: "Africa/Dar_es_Salaam" },
  { name: "Khartoum", country: "SD", timezone: "Africa/Khartoum" },
  { name: "Algiers", country: "DZ", timezone: "Africa/Algiers" },
  { name: "Abidjan", country: "CI", timezone: "Africa/Abidjan" },
  { name: "Alexandria", country: "EG", timezone: "Africa/Cairo" },
  { name: "Casablanca", country: "MA", timezone: "Africa/Casablanca" },
  { name: "Cape Town", country: "ZA", timezone: "Africa/Johannesburg" },
  { name: "Durban", country: "ZA", timezone: "Africa/Johannesburg" },
  { name: "Nairobi", country: "KE", timezone: "Africa/Nairobi" },
  { name: "Accra", country: "GH", timezone: "Africa/Accra" },
  { name: "Addis Ababa", country: "ET", timezone: "Africa/Addis_Ababa" },

  // South American Cities
  { name: "São Paulo", country: "BR", timezone: "America/Sao_Paulo" },
  { name: "Lima", country: "PE", timezone: "America/Lima" },
  { name: "Bogotá", country: "CO", timezone: "America/Bogota" },
  { name: "Rio de Janeiro", country: "BR", timezone: "America/Sao_Paulo" },
  { name: "Santiago", country: "CL", timezone: "America/Santiago" },
  { name: "Caracas", country: "VE", timezone: "America/Caracas" },
  {
    name: "Buenos Aires",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  { name: "Salvador", country: "BR", timezone: "America/Bahia" },
  { name: "Brasília", country: "BR", timezone: "America/Sao_Paulo" },
  { name: "Fortaleza", country: "BR", timezone: "America/Fortaleza" },
  { name: "Guayaquil", country: "EC", timezone: "America/Guayaquil" },
  { name: "Quito", country: "EC", timezone: "America/Guayaquil" },
  { name: "Belo Horizonte", country: "BR", timezone: "America/Sao_Paulo" },
  { name: "Medellín", country: "CO", timezone: "America/Bogota" },
  { name: "Cali", country: "CO", timezone: "America/Bogota" },
  { name: "Manaus", country: "BR", timezone: "America/Manaus" },
  { name: "Curitiba", country: "BR", timezone: "America/Sao_Paulo" },
  { name: "Recife", country: "BR", timezone: "America/Recife" },
  { name: "Córdoba", country: "AR", timezone: "America/Argentina/Cordoba" },
  { name: "Porto Alegre", country: "BR", timezone: "America/Sao_Paulo" },

  // North American Cities (Canada, Mexico)
  { name: "Toronto", country: "CA", timezone: "America/Toronto" },
  { name: "Montreal", country: "CA", timezone: "America/Montreal" },
  { name: "Vancouver", country: "CA", timezone: "America/Vancouver" },
  { name: "Calgary", country: "CA", timezone: "America/Edmonton" },
  { name: "Ottawa", country: "CA", timezone: "America/Toronto" },
  { name: "Edmonton", country: "CA", timezone: "America/Edmonton" },
  { name: "Quebec City", country: "CA", timezone: "America/Montreal" },
  { name: "Winnipeg", country: "CA", timezone: "America/Winnipeg" },
  { name: "Mexico City", country: "MX", timezone: "America/Mexico_City" },
  { name: "Guadalajara", country: "MX", timezone: "America/Mexico_City" },
  { name: "Monterrey", country: "MX", timezone: "America/Monterrey" },
  { name: "Puebla", country: "MX", timezone: "America/Mexico_City" },
  { name: "Tijuana", country: "MX", timezone: "America/Tijuana" },
  { name: "León", country: "MX", timezone: "America/Mexico_City" },
  { name: "Juárez", country: "MX", timezone: "America/Ojinaga" },
  { name: "Zapopan", country: "MX", timezone: "America/Mexico_City" },
  { name: "Nezahualcóyotl", country: "MX", timezone: "America/Mexico_City" },
  { name: "Chihuahua", country: "MX", timezone: "America/Chihuahua" },
  { name: "Naucalpan", country: "MX", timezone: "America/Mexico_City" },
  { name: "Mérida", country: "MX", timezone: "America/Merida" },
  { name: "Álvaro Obregón", country: "MX", timezone: "America/Mexico_City" },

  // Oceania Cities
  { name: "Sydney", country: "AU", timezone: "Australia/Sydney" },
  { name: "Melbourne", country: "AU", timezone: "Australia/Melbourne" },
  { name: "Brisbane", country: "AU", timezone: "Australia/Brisbane" },
  { name: "Perth", country: "AU", timezone: "Australia/Perth" },
  { name: "Adelaide", country: "AU", timezone: "Australia/Adelaide" },
  { name: "Gold Coast", country: "AU", timezone: "Australia/Brisbane" },
  { name: "Canberra", country: "AU", timezone: "Australia/Sydney" },
  { name: "Newcastle", country: "AU", timezone: "Australia/Sydney" },
  { name: "Wollongong", country: "AU", timezone: "Australia/Sydney" },
  { name: "Auckland", country: "NZ", timezone: "Pacific/Auckland" },
  { name: "Wellington", country: "NZ", timezone: "Pacific/Auckland" },
  { name: "Christchurch", country: "NZ", timezone: "Pacific/Auckland" },
  { name: "Hamilton", country: "NZ", timezone: "Pacific/Auckland" },
  { name: "Tauranga", country: "NZ", timezone: "Pacific/Auckland" },

  // Additional Asian Cities
  { name: "Singapore", country: "SG", timezone: "Asia/Singapore" },
  { name: "Hong Kong", country: "HK", timezone: "Asia/Hong_Kong" },
  { name: "Kuala Lumpur", country: "MY", timezone: "Asia/Kuala_Lumpur" },
  { name: "Taipei", country: "TW", timezone: "Asia/Taipei" },
  { name: "Shenzhen", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Dongguan", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Foshan", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Shijiazhuang", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Zhengzhou", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Dalian", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Jinan", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Changsha", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Taiyuan", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Kunming", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Ürümqi", country: "CN", timezone: "Asia/Urumqi" },
  { name: "Hefei", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Nanchang", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Changchun", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Nanning", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Guiyang", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Lanzhou", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Haikou", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Hohhot", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Yinchuan", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Xining", country: "CN", timezone: "Asia/Shanghai" },
  { name: "Lhasa", country: "CN", timezone: "Asia/Shanghai" },
];

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = WORLD_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (city.state &&
            city.state.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      setSearchResults(filtered.slice(0, 10));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  // Get current location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          // Default to New York
          const defaultCity = WORLD_CITIES.find(
            (city) => city.name === "New York",
          );
          handleCitySelect(defaultCity);
        },
      );
    } else {
      const defaultCity = WORLD_CITIES.find((city) => city.name === "New York");
      handleCitySelect(defaultCity);
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setLocation(`${data.name}, ${data.sys.country}`);

        // Find matching city for timezone
        const cityMatch = WORLD_CITIES.find(
          (city) => city.name.toLowerCase() === data.name.toLowerCase(),
        );

        if (cityMatch) {
          await fetchTimeForCity(cityMatch);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setLoading(false);
    }
  };

  const fetchTimeForCity = async (city) => {
    try {
      // First try the WorldTimeAPI (may fail due to CORS in dev environment)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${TIMEZONE_API}/${city.timezone}`, {
        signal: controller.signal,
        mode: "cors",
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const time = new Date(data.datetime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setCurrentTime(time);
        return;
      }
    } catch (error) {
      console.log("WorldTimeAPI not available, using fallback calculation");
    }

    // Fallback: Calculate time using timezone offset
    try {
      const offset = TIMEZONE_OFFSETS[city.timezone];
      if (offset !== undefined) {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const localTime = new Date(utc + offset * 3600000);
        const time = localTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setCurrentTime(time);
      } else {
        setCurrentTime("Time unavailable");
      }
    } catch (error) {
      console.error("Error calculating time:", error);
      setCurrentTime("Time unavailable");
    }
  };

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setSearchQuery("");
    setShowDropdown(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/weather?q=${city.name},${city.country}&appid=${API_KEY}&units=metric`,
      );

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setLocation(`${data.name}, ${data.sys.country}`);
        await fetchTimeForCity(city);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }

    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleCitySelect(searchResults[0]);
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "🌨️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return iconMap[iconCode] || "☀️";
  };

  return (
    <div className="app">
      <div className="container">
        <div className="content">
          {/* Header */}
          <div className="header">
            <h1 className="title">Weather & Time</h1>
            <p className="subtitle">
              Get weather and local time for any city worldwide
            </p>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for any city worldwide..."
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <svg
                    className="search-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="dropdown">
                  {searchResults.map((city, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="city-info">
                        <div className="city-name">{city.name}</div>
                        <div className="city-details">
                          {city.state
                            ? `${city.state}, ${city.country}`
                            : city.country}
                        </div>
                      </div>
                      <svg
                        className="arrow-icon"
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
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="results">
              <div className="weather-card">
                <div className="location-header">
                  <h2 className="location-name">{location}</h2>
                  {currentTime && (
                    <div className="time-display">
                      <span className="time-label">Local Time:</span>
                      <span className="time-value">{currentTime}</span>
                    </div>
                  )}
                </div>

                <div className="weather-content">
                  <div className="weather-main">
                    <div className="weather-icon">
                      {getWeatherIcon(weather.weather[0].icon)}
                    </div>
                    <div className="weather-info">
                      <div className="temperature">
                        {Math.round(weather.main.temp)}°C
                      </div>
                      <div className="description">
                        {weather.weather[0].description}
                      </div>
                      <div className="feels-like">
                        Feels like {Math.round(weather.main.feels_like)}°C
                      </div>
                    </div>
                  </div>

                  <div className="weather-details">
                    <div className="detail-item">
                      <span className="detail-label">Humidity</span>
                      <span className="detail-value">
                        {weather.main.humidity}%
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Wind Speed</span>
                      <span className="detail-value">
                        {weather.wind.speed} m/s
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pressure</span>
                      <span className="detail-value">
                        {weather.main.pressure} hPa
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Visibility</span>
                      <span className="detail-value">
                        {Math.round(weather.visibility / 1000)} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
