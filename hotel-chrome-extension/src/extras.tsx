import React from "react";
import "./cssFiles/App.css";
import "./cssFiles/index.css";
import "./cssFiles/extras.css";
import search from './icons/search_icon.svg';
import greyHouse from './icons/house_icon_grey.svg';
import pointer from './icons/pointer-arrow.svg';
import plusYellow from "./icons/plus_yellow.svg";

import App from "./App";
import Recent from "./recents";
import Providers from "./providerView";

function Extras() {

  const [showHome, setShowHome] = React.useState(false);
  const [showRecents, setShowRecents] = React.useState(false);
  const [showProviders, setShowProviders] = React.useState(false);


  const handleHomeClick = () => {
    setShowHome(!showHome);
  };

  const handleRecentsClick = () => {
    setShowRecents(!showRecents);
  };

  const handleProvidersClick = () => {
    setShowProviders(!showProviders);
  };

  return (
    <div>
      {showHome ? (
        <App />
      ) : showProviders ? (
        <Providers />
      ) : showRecents ? (
        <Recent getHotelPrice={function (hotelName: string, hotelRoom: string, arrivalDate: string, departureDate: string): void {
            throw new Error("Function not implemented.");
          } } />
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
                      <text> Help </text>
                    </div>
                    <div className="pointer-arrow-container">
                      <img className="pointer-arrow" src={pointer} />
                    </div>
                  </a>
                </a>
                <a className="options-card-wrapper" onClick={handleProvidersClick}>
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
                <img src={search} className="bottom-nav-item" alt="search icon" onClick={handleRecentsClick} />
                <img src={greyHouse} className="bottom-nav-item" alt="home icon" onClick={handleHomeClick} />
                <img src={plusYellow} className="bottom-nav-item" alt="plus icon" />
              </div>
            </div>
          </body>
        </>
      )}
    </div>
  );
}

export default Extras;
