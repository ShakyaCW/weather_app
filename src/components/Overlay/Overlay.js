import React, { useState, useEffect } from 'react';
import './Overlay.css';

const Overlay = ({
  cityName,
  country,
  formattedTime,
  description,
  celcius,
  fahrenheit,
  tempMin,
  tempMax,
  pressure,
  humidity,
  sunriseTime,
  sunsetTime,
  onCloseOverlay,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to track overlay visibility

  useEffect(() => {
    setIsOpen(true); // Open the overlay when the component mounts
  }, []);

  const onClose = () => {
    setIsOpen(false);
    onCloseOverlay(); // Call the onCloseOverlay prop to handle overlay close
  };

  return (
    <div>
      {isOpen && (
        <div id="myNav" className="overlay">
          <a className="closebtn" onClick={onClose}>
            &times;
          </a>
          <div className="overlay-content" id="overlay-content">
            <div className="wrapper">
              <div className="widget-container">
                <div className="top-left">
                  <h1 className="city" id="city">{cityName}, {country}</h1>
                  <h2 id="day">{formattedTime}</h2>
                  <h3 id="date"></h3>
                  {/* <h3 id="time">{day}/{monthName}/{year}</h3> */}
                  <p className="geo"></p>
                </div>
                <div className="top-right">
                  <h1 id="weather-status">{description}</h1>
                  <img className="weather-icon" src="https://myleschuahiock.files.wordpress.com/2016/02/sunny2.png" alt="Weather Icon" />
                </div>
                <div className="horizontal-half-divider"></div>
                <div className="bottom-left">
                  <h1 id="temperature">{celcius}</h1>
                  <h2 id="celsius">&deg;C</h2>
                  <h2 id="temp-divider">/</h2>
                  <h2 id="fahrenheit">{fahrenheit}&deg;F</h2>
                </div>
                <div className="vertical-half-divider"></div>
                <div className="bottom-right">
                  <div className="other-details-key">
                    <p>Temp Min</p>
                    <p>Temp Max</p>
                    <p>Pressure</p>
                    <p>Humidity</p>
                    <p>Sunrise Time</p>
                    <p>Sunset Time</p>
                  </div>
                  <div className="other-details-values">
                    <p className="windspeed">{Math.round(tempMin - 273)} &deg;C</p>
                    <p className="humidity">{Math.round(tempMax - 273)} &deg;C</p>
                    <p className="pressure">{pressure} hPa</p>
                    <p className="sunrise-time">{humidity}%</p>
                    <p className="sunset-time">{sunriseTime}</p>
                    <p className="sunset-time">{sunsetTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }

    </div>

  );

};

export default Overlay;