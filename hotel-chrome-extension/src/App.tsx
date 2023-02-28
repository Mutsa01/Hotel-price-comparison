import React from 'react';
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
import search from './icons/search_icon.svg';
import house from './icons/house_icon1.svg';
import plus from './icons/plus_grey.svg';
import './App.css';
import { DOMMessage, DOMMessageResponse } from './types';

function App() {
  const handleExitClick = () => {
    window.close();
  };

  // react useState hook to store data from DOM
  const [title, setTitle] = React.useState('');
  const [headlines, setHeadlines] = React.useState<string[]>([]);
  const [hotelName, setHotelName] = React.useState('');
  const [hotelPrice, setHotelPrice] = React.useState('');
  const [tripRecievedPrice, setTripRecievedPrice] = React.useState('');

  //pass hotelName to trip_scraper.js dunction and get hotel price

  function getHotelPrice(hotelName: string) {
    fetch(`http://localhost:5000/get-hotel-price/${hotelName}`)
      .then(response => response.json())
      .then(data => {
        // handle the response data here
        setTripRecievedPrice(data);
        console.log(data);
      })
      .catch(error => {
        // handle any errors here
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  
  React.useEffect(() => {
    /**
     * can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        // specify tab to send message to
        tabs[0].id || 0,
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {
          setTitle(response.title);
          setHeadlines(response.headlines);
          setHotelName(response.hotelName);
          setHotelPrice(response.hotelPrice);
          getHotelPrice(response.hotelName);
        });
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span className="company-name">
          Cosmic Rates
        </span>
        <div className="exit-box" onClick={handleExitClick}>
          <img src={exit} className='exit-icon' alt='exit icon' />
        </div>
      </header>
      <body>
        <div className="content-container">
        <div className="providers-list">
          <a className="provider-card-wrapper">
            <div className="provider-card">
            </div>
          </a>
          <a className="provider-card-wrapper">
            <div className="provider-card">
            </div>
          </a>
          <a className="provider-card-wrapper">
            <div className="provider-card">
            </div>
          </a>
          <a className="provider-card-wrapper">
            <div className="provider-card">
            </div>
          </a>
          <a className="provider-card-wrapper">
            <div className="provider-card">
            </div>
          </a>
        </div>
        <div className="bottom-nav-container">
          <img src={search} className="bottom-nav-item" alt="search icon" />
          <img src={house} className="bottom-nav-item" alt="home icon" />
          <img src={plus} className="bottom-nav-item" alt="plus icon" />
          <text>
            {hotelPrice}
          </text>
          {/* enter hotel name returned */}
          <text>
            {hotelName}
          </text>
        </div>
        </div>
      </body>
    </div>
  );
}

export default App;
