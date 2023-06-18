import React, { useState } from 'react';
import './InputBox.css';

const InputBox = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    onSearch(city);
    setCity('');
  };

  return (
    <div className="input-box">
      <i className="uil uil-search"></i>
      <input
        type="text"
        placeholder="Enter City..."
        value={city}
        onChange={handleInputChange}
      />
      <button className="button" onClick={handleSearch}>
        Add City
      </button>
    </div>
  );
};

export default InputBox;
