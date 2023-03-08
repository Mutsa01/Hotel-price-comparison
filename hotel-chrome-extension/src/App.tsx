import React from 'react';
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
import search from './icons/search_icon.svg';
import house from './icons/house_icon1.svg';
import plus from './icons/plus_grey.svg';
import './App.css';
import { DOMMessage, DOMMessageResponse } from './types';
import { trackPromise } from 'react-promise-tracker';
import {ThreeDots} from 'react-loader-spinner'

function App() {
  const handleExitClick = () => {
    window.close();
  };

  // react useState hook to store data from DOM
  const [title, setTitle] = React.useState('');
  const [headlines, setHeadlines] = React.useState<string[]>([]);
  const [hotelName, setHotelName] = React.useState('');
  const [hotelPrice, setHotelPrice] = React.useState('');
  const [hotelRoom, setHotelRoom] = React.useState('');
  const [tripRecievedPrice, setTripHotelPrice] = React.useState('');
  const[isLoading, setIsLoading] = React.useState(true);

  //pass hotelName to trip_scraper.js dunction and get hotel price


  function getHotelPrice(hotelName: string, hotelRoom: string) {
    trackPromise(
      //make a fetch request to the backend with the hotel name and room type
      fetch(`http://localhost:5000/get-hotel-price/${hotelName}/${hotelRoom}`)
        .then(response => response.json())
        .then(data => {
          // handle the response data here
          setTripHotelPrice(JSON.stringify(data));
          setIsLoading(false);
          console.log(data);
          console.log(tripRecievedPrice);
        })
        .catch(error => {
          // handle any errors here
          console.error('There was a problem with the fetch operation:', error);
          setIsLoading(false);
        }));
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
          setHotelRoom(response.hotelRoom);
          getHotelPrice(response.hotelName, response.hotelRoom);
        });
    });
  }, []);

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
                {/* show the result of the gethotelprice function*/}
                {isLoading ? (
                  <div className="spinner-container" role="status">
                    <ThreeDots
                    color= "#282c34"
                    width= "60"
                    />
                    {/* <span className="visually-hidden">Loading now...</span> */}
                  </div>
                ) : (
                  <text> {tripRecievedPrice} </text>
                )}

              </div>
            </a>
            <a className="provider-card-wrapper">
              <div className="provider-card">
                <text>
                  {hotelName}
                </text>
              </div>
            </a>
            <a className="provider-card-wrapper">
              <div className="provider-card">
                {hotelRoom}
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
