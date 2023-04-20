import React from "react";
import "./cssFiles/App.css";
import "./cssFiles/index.css";
import "./cssFiles/extras.css";
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
import yellowSearch from './icons/search_icon_yellow.svg';
import greyHouse from './icons/house_icon_grey.svg';
import pointer from './icons/pointer-arrow.svg';
import { Link } from "react-router-dom";
import greyPlus from "./icons/plus_grey.svg";

import App from "./App";
import Extras from "./extras";

function Recent() {

  const [showHome, setShowHome] = React.useState(false);
  const [showExtras, setShowExtras] = React.useState(false);


  const handleHomeClick = () => {
    setShowHome(!showHome);
  };

  const handlePlusClick = () => {
    setShowExtras(!showExtras);
  };

  return (
    <div>
      {showHome ? (
        <App />
        ) : showExtras ? (
            <Extras />
          ) : (
        <>
          <body>
            <div className="content-container">
              <div className="providers-list">
                <a className="options-card-wrapper">
                  <a className="options-card">
                    <div className="provider-logo-container">
                    </div>
                    <div className="option-text">
                      <text> Helpcfs </text>
                    </div>
                    <div className="pointer-arrow-container">
                      <img className="pointer-arrow" src={pointer} />
                    </div>
                  </a>
                </a>
                <a className="options-card-wrapper">
                  <a className="options-card">
                    <div className="provider-logo-container">
                    </div>
                    <div className="option-text">
                      <text> Providers</text>
                    </div>
                    <div className="pointer-arrow-container">
                      <img className="pointer-arrow" src={pointer} />
                    </div>
                  </a>
                </a>
                <a className="options-card-wrapper">
                  <a className="options-card">
                    <div className="provider-logo-container">
                    </div>
                    <div className="option-text">
                      <text> About</text>
                    </div>
                    <div className="pointer-arrow-container">
                      <img className="pointer-arrow" src={pointer} />
                    </div>
                  </a>
                </a>
              </div>
              <div className="bottom-nav-container">
                <img src={yellowSearch} className="bottom-nav-item" alt="search icon" />
                <img src={greyHouse} className="bottom-nav-item" alt="home icon" onClick={handleHomeClick} />
                <img src={greyPlus} className="bottom-nav-item" alt="plus icon" onClick = {handlePlusClick} />
              </div>
            </div>
          </body>
        </>
      )}
      {showHome}
    </div>
  );
}

export default Recent;
