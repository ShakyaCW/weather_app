import React, { useState, useEffect } from 'react';
import './WeatherCard.css';
import Overlay from '../Overlay/Overlay';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const WeatherCard = ({ cityName, celcius, description, cityId, country, tempMin, tempMax, pressure, humidity, sunrise, sunset, visibility, windSpeed, windDegree }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState(null);
  const [time, setTime] = useState(null);
  const [sunsetTime, setSunsetTime] = useState(null);
  const [sunriseTime, setSunriseTime] = useState(null);

  useEffect(() => {
    // Check if cached data exists and if it's still valid
    const cachedData = localStorage.getItem(cityId);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const { expirationTime, data } = parsedData;
      if (expirationTime > Date.now()) {
        setOverlayData(data);
        setSunriseTime(parsedData.sunriseTime);
        setSunsetTime(parsedData.sunsetTime);
        setTime(parsedData.time);
        console.log(`Loading data from cache for ${cityName}`);
      } else {
        console.log(`Cache expired. Fetching data from API for ${cityName}`);
        fetchData();
      }
    } else {
      console.log(`Fetching data from API for ${cityName}`);
      fetchData();
    }
  }, [cityId, cityName]);

  const fetchData = async () => {
    try {
      const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      setOverlayData(data); // Save the extracted data for the overlay

      const timeZoneOffset = data.timezone;
      const currentDate = new Date();
      // Remove the time zone offset from the current time
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      const currentTime = new Date(
        currentDate.getTime() + timeZoneOffset * 1000 - 19800 * 1000
      );
      const formattedTime = currentTime.toLocaleString('en-US', options);

      const sunriseTime = new Date(
        data.sys.sunrise * 1000 + data.timezone * 1000 - 19800 * 1000
      ).toLocaleTimeString();
      const sunsetTime = new Date(
        data.sys.sunset * 1000 + data.timezone * 1000 - 19800 * 1000
      ).toLocaleTimeString();
      setSunriseTime(sunriseTime);
      setSunsetTime(sunsetTime);

      setTime(formattedTime);

      // Cache the data with an expiration time of 5 minutes
      const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
      const cachedData = {
        expirationTime,
        data,
        sunriseTime,
        sunsetTime,
        time: formattedTime,
      };
      localStorage.setItem(cityId, JSON.stringify(cachedData));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFindMore = async () => {
    setTime(new Date().toLocaleTimeString());
    const cachedData = localStorage.getItem(cityId);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const { expirationTime, data } = parsedData;
      if (expirationTime > Date.now()) {
        setOverlayData(data);
        setSunriseTime(parsedData.sunriseTime);
        setSunsetTime(parsedData.sunsetTime);
        setTime(parsedData.time);
        setShowOverlay(true);
        console.log(`Loading data from cache for ${cityName}`);
      } else {
        console.log(`Cache expired. Fetching data from API for ${cityName}`);
        await fetchData(); // Wait for data to be fetched
        setShowOverlay(true); // Open the overlay
      }
    } else {
      console.log(`Fetching data from API for ${cityName}`);
      await fetchData(); // Wait for data to be fetched
      setShowOverlay(true); // Open the overlay
    }
  };



  const handleCloseOverlay = () => {
    setShowOverlay(false); // Close the overlay
  };

  return (
    <div className="container">
      {/* ---------------------------------------------------------------------------------------------------------------- */}

      <div>

        <div className={"innerContainer"}>
          <div className={"cards"}>


            <div className="main-card">
              <div className="overlay"></div>
              <div className="card-top">
                <div className="top-lefty column">
                  <h3 className='city'>{cityName}, {country}</h3>
                  <p className={"time-para"}>{time}</p>

                  <span className={"current-status"}>
                    <FontAwesomeIcon icon={faCloud} style={{ color: "#fffff", }} size={"lg"} />
                    <p>{description}</p>
                  </span>
                </div>
                <div className={"top-righty column"}>
                  <h3 className={"temp"}>{celcius}&deg;C</h3>

                  <div className={"min-max"}>
                    <p className='minTemp'>Temp Min: {tempMin}&deg;C</p>
                    <p className='maxTemp'>Temp Max: {tempMax}&deg;C</p>
                  </div>
                </div>
              </div>

              <div className={"card-bottom"}>
                <div className="vertical-line"></div>
                <div className={"card-bottom-left"}>

                  <div className={"conditions"}>
                    <span className={"condition-label"}>Pressure: </span>
                    <span>{pressure}hPa</span>
                  </div>

                  <div className={"conditions"}>
                    <span className={"condition-label"}>Humidity: </span> <span>{humidity}%</span>
                  </div>

                  <div className={"conditions"}>
                    <span className={"condition-label"}>Visibility: </span>
                    <span>{visibility} Km</span>
                  </div>
                </div>

                <div className={"card-bottom-middle"}>
                  <FontAwesomeIcon className={"rocket-icon"} icon={faPaperPlane}
                    style={{ color: "#fffff", }} size={"2x"} />
                  <p> {windSpeed}m/s {windDegree} Degree</p>
                </div>
                <div className="vertical-line-two"></div>


                <div className={"card-bottom-right"}>

                  <div className={"conditions"}>
                    <span className={"condition-label"}>Sunrise: </span> <span>{sunrise}</span>
                  </div>

                  <div className={"conditions"}>
                    <span className={"condition-label"}>Sunset : </span> <span>{sunset}</span>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>


      </div>


      <div className='button'>
        {!showOverlay && (
          <button className="btn" id={cityId} onClick={handleFindMore}>
            Find More
          </button>
        )}
      </div>



      {/* ---------------------------------------------------------------------------------------------------------------- */}


      {showOverlay && overlayData && (
        <Overlay
          cityName={cityName}
          country={overlayData.sys.country}
          formattedTime={time}
          description={overlayData.weather[0].description}
          celcius={Math.round(overlayData.main.temp - 273)}
          fahrenheit={Math.round((overlayData.main.temp - 273) * (9 / 5) + 32)}
          tempMin={Math.round(overlayData.main.temp_min)}
          tempMax={Math.round(overlayData.main.temp_max)}
          pressure={overlayData.main.pressure}
          humidity={overlayData.main.humidity}
          sunriseTime={sunriseTime}
          sunsetTime={sunsetTime}
          onCloseOverlay={handleCloseOverlay}
        />
      )}
    </div>
  );
};

export default WeatherCard;
