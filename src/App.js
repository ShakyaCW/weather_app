import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WeatherCard from './components/WeatherCard/WeatherCard';
import InputBox from './components/InputBox/InputBox';
import './App.css';
import jsonData from './cities.json';

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

// Function to extract city codes from the JSON data
const extractCityCodes = async () => {
  try {
    return jsonData.List.map((city) => city.CityCode);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Function to fetch weather data for a given city code
const fetchWeatherData = async (cityCode) => {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error:', error);
  }
};

const App = () => {
  const [cityCodes, setCityCodes] = React.useState([]);
  const [weatherData, setWeatherData] = React.useState([]);

  // Fetch city codes when the component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const codes = await extractCityCodes();
        setCityCodes(codes);
      } catch (error) {
        toast.error('Failed to fetch city codes.');
      }
    };

    fetchData();
  }, []);

  // Fetch weather data for cities when the city codes change
  React.useEffect(() => {
    const fetchWeatherDataForCities = async () => {
      const weatherDataPromises = cityCodes.map((cityCode) => fetchWeatherData(cityCode));
      try {
        const resolvedWeatherData = await Promise.all(weatherDataPromises);
        setWeatherData(resolvedWeatherData);
      } catch (error) {
        toast.error('Failed to fetch weather data.');
      }
    };

    fetchWeatherDataForCities();
  }, [cityCodes]);

  // Function to handle search button click
  const handleSearch = async (city) => {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        toast.error(`'${city}' Not Found!`);
      } else {
        toast.success(`'${city}' added successfully!`);
      }

      const data = await response.json();

      // Extract the city ID from the response
      const cityId = data.id;

      // Add the city ID to the cityCodes state
      setCityCodes((prevCityCodes) => [...prevCityCodes, cityId]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="main">

      <div id="appName">
        <h1 className='heading'>Weather App</h1>
      </div>
      <div className="inputBox">
        <InputBox onSearch={handleSearch} />
      </div>

      <div className="weather-cards">
        {weatherData.map((weather, index) => (
          weather && weather.main && weather.weather ? (
            <WeatherCard
              key={index}
              cityName={weather.name}
              celcius={Math.round(weather.main.temp - 273)}
              description={weather.weather[0].description}
              cityId={weather.id}
              cityCode={cityCodes[index]}
              country={weather.sys.country}
              tempMin={Math.round(weather.main.temp_min - 273)}
              tempMax={Math.round(weather.main.temp_max - 273)}
              pressure={weather.main.pressure}
              humidity={weather.main.humidity}
              sunrise={new Date(
                weather.sys.sunrise * 1000 + weather.timezone * 1000 - 19800 * 1000
              ).toLocaleTimeString()}
              sunset={new Date(
                weather.sys.sunset * 1000 + weather.timezone * 1000 - 19800 * 1000
              ).toLocaleTimeString()}
              visibility={weather.visibility / 1000}
              windSpeed={weather.wind.speed}
              windDegree={weather.wind.deg}
            />
          ) : null

        ))}


      </div>

      <ToastContainer />


    </div>

  );
};

export default App;
