import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudSun, faCloud, faSmog, faCloudSunRain, faBolt, faWind, faCloudRain, faCloudShowersHeavy, faCloudMeatball, faQuestion, faAngleUp, faAngleDown, faTint } from '@fortawesome/free-solid-svg-icons';

const WeatherApp = () => {
  const [selectedLocation, setSelectedLocation] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fetchWeatherData = async (location) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=b5a4909276a141599c7153217233105&q=${location}`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedLocation);
    handleViewportChange(); // Vede de pe ce te uiti
    window.addEventListener('resize', handleViewportChange); // vede daca dai zoom

    return () => {
      window.removeEventListener('resize', handleViewportChange); // Cleanup the event listener on component unmount
    };
  }, [selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedLocation(searchQuery);
    setSearchQuery('');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewportChange = () => {
    setIsMobile(window.innerWidth <= 768); // Set isMobile state based on viewport width
  };

  const getSuggestiveIcon = (code) => {
    switch (code) {
      case 1000: // Clear
        return faSun;
      case 1003: // Partly cloudy
        return faCloudSun;
      case 1006: // Cloudy
      case 1009: // Overcast
        return faCloud;
      case 1030: // Mist
      case 1135: // Fog
      case 1147: // Freezing fog
        return faSmog;
      case 1063: // Patchy rain possible
      case 1066: // Patchy snow possible
      case 1069: // Patchy sleet possible
      case 1072: // Patchy freezing drizzle possible
        return faCloudSunRain;
      case 1087: // Thundery outbreaks possible
        return faBolt;
      case 1114: // Blowing snow
      case 1117: // Blizzard
        return faWind;
      case 1132: // Fog
      case 1144: // Freezing fog
        return faSmog;
      case 1150: // Patchy light drizzle
      case 1153: // Light drizzle
      case 1168: // Freezing drizzle
      case 1171: // Heavy freezing drizzle
        return faCloudRain;
      case 1180: // Patchy light rain
      case 1183: // Light rain
      case 1186: // Moderate rain at times
      case 1189: // Moderate rain
      case 1192: // Heavy rain at times
      case 1195: // Heavy rain
      case 1198: // Torrential rain shower
        return faCloudShowersHeavy;
      case 1201: // Patchy light snow
      case 1204: // Light snow
      case 1207: // Patchy moderate snow
      case 1210: // Moderate snow
      case 1213: // Patchy heavy snow
      case 1216: // Heavy snow
      case 1219: // Ice pellets
      case 1222: // Light sleet
      case 1225: // Moderate or heavy sleet
      case 1237: // Light showers of ice pellets
      case 1240: // Light rain shower
      case 1243: // Moderate or heavy rain shower
      case 1246: // Ice pellets shower
      case 1249: // Moderate or heavy showers of ice pellets
      case 1252: // Light showers of ice pellets
      case 1255: // Light sleet showers
      case 1258: // Moderate or heavy sleet showers
      case 1261: // Light snow showers
      case 1264: // Moderate or heavy snow showers
        return faCloudMeatball;
      default:
        return faQuestion;
    }
  };

  return (
    <div className={`weather-app ${isMobile ? 'mobile' : 'desktop'}`}>
    <div className="weather-app">
      <h1>Solar</h1>
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Enter location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {weatherData ? (
        weatherData.error ? (
          <div>{weatherData.error.message}</div>
        ) : (
          <div className="weather-card">
            <h2>{weatherData.location?.name}</h2>
            <div className="weather-info">
              <div className="weather-icon">
                <FontAwesomeIcon icon={getSuggestiveIcon(weatherData.current?.condition?.code)} />
              </div>
              <div className="temperature">{weatherData.current?.temp_c}°C</div>
            </div>
            <div className={`details-dropdown ${isDropdownOpen ? 'open' : ''}`}>
              <div className="dropdown-header" onClick={toggleDropdown}>
                <span>Details</span>
                <FontAwesomeIcon icon={isDropdownOpen ? faAngleUp : faAngleDown} className="arrow-icon" />
              </div>
              <div className="details-dropdown-content">
                <div className="details-dropdown-item">
                  <FontAwesomeIcon icon={faTint} />
                   Humidity: {weatherData.current?.humidity}%
                </div>
                <div className="details-dropdown-item">
                  <FontAwesomeIcon icon={faWind} />
                   Wind Speed: {weatherData.current?.wind_kph} km/h
                </div>
                <div className="details-dropdown-item">
                  <FontAwesomeIcon icon={faSun} />
                   UV Index: {weatherData.current?.uv}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
    </div>
  );
};

export default WeatherApp;
