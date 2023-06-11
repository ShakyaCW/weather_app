import React from 'react';
import './InputBox.css';

const InputBox = () => {
  return (
    
      <div className="input-box">
        <i className="uil uil-search"></i>
        <input type="text" placeholder="Enter City..." />
        <button className="button">Add City</button>
      </div>
    
  );
};

export default InputBox;
