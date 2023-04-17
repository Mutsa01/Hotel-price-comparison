import React from 'react';
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
import search from './icons/search_icon.svg';
import house from './icons/house_icon1.svg';
import plus from './icons/plus_grey.svg';
import tripLogo from './providerLogos/trip-com-logo.jpeg';
import hotelsComLogo from './providerLogos/hotels-com-logo.jpg';
import expediaLogo from './providerLogos/expedia-logo.png';
import pointer from './icons/pointer-arrow.svg';
import './App.css';
import { DOMMessage, DOMMessageResponse } from './types';
import { trackPromise } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner'

function App() {
  const handleExitClick = () => {
    window.close();
  };

  // react useState hook to store data from DOM
  const [hotelName, setHotelName] = React.useState('');
  const [hotelPrice, setHotelPrice] = React.useState('');
  const [hotelRoom, setHotelRoom] = React.useState('');
  const [arrivalDate, setArrivalDate] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState('');
  const [tripRecievedPrice, setTripHotelPrice] = React.useState('');
  const [tripRecievedUrl, setTripHotelUrl] = React.useState('');
  const [hotelsComRecievedPrice, setHotelsComHotelPrice] = React.useState('');
  const [hotelsComRecievedUrl, setHotelsComHotelUrl] = React.useState('');
  const [expediaRecievedPrice, setExpediaHotelPrice] = React.useState('');
  const [expediaRecievedUrl, setExpediaHotelUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  //pass hotelName to trip_scraper.js function and get hotel price


  function getHotelPrice(hotelName: string, hotelRoom: string, arrivalDate: string, departureDate: string) {
    //encode hotel name and room type to be passed to the backend as a url parameter
    const encodedHotelName = encodeURIComponent(hotelName);
    const encodedHotelRoom = encodeURIComponent(hotelRoom);
    const encodedArrivalDate = encodeURIComponent(arrivalDate);
    const encodedDepartureDate = encodeURIComponent(departureDate);

    trackPromise(
      //make a fetch request to the backend with the hotel name and room type
      fetch(`http://localhost:5000/get-hotel-price/${encodedHotelName}/${encodedHotelRoom}/${encodedArrivalDate}/${encodedDepartureDate}`)
        .then(response => response.json())
        .then(data => {
          // handle the response data here
          // console.log(data);
          data.forEach((result: { provider: any; price: any; hotelUrl: any; }) => {
            const { provider, price, hotelUrl } = result;
            if (provider === 'trip.com') {
              setTripHotelPrice(JSON.stringify(price).replace(/['"]+/g, ''));
              setTripHotelUrl(JSON.stringify(hotelUrl).replace(/['"]+/g, ''));
              setIsLoading(false);
            } else if (provider === 'hotels.com') {
              setHotelsComHotelPrice(JSON.stringify(price).replace(/['"]+/g, ''));
              setHotelsComHotelUrl(JSON.stringify(hotelUrl).replace(/['"]+/g, ''));
              setIsLoading(false);
            } else if (provider === 'expedia') {
              setExpediaHotelPrice(JSON.stringify(price).replace(/['"]+/g, ''));
              setExpediaHotelUrl(JSON.stringify(hotelUrl).replace(/['"]+/g, ''));
              setIsLoading(false);
            }
          });
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
          // handle response from content script
          setHotelName(response.hotelName);
          setHotelPrice(response.hotelPrice);
          setHotelRoom(response.hotelRoom);
          setArrivalDate(response.arrivalDate);
          setDepartureDate(response.departureDate);
          console.log(response);

          //pass hoteldetails to function which will make a fetch request to the backend
          getHotelPrice(response.hotelName, response.hotelRoom, response.arrivalDate, response.departureDate);
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
              {/* show the result of the gethotelprice function*/}
              {isLoading ? (
                <div className="provider-card">
                  <div className="spinner-container" role="status">
                    <ThreeDots
                      color="#282c34"
                      width="60"
                    />
                  </div>
                </div>
              ) : (
                <a className="provider-card" href={tripRecievedUrl} target="_blank">
                  <div className="provider-logo-container">
                    <img className="provider-image" src={tripLogo} alt="trip.com logo" />
                  </div>
                  <div className="provider-name">
                    <text> Trip.com </text>
                  </div>
                  {/* if string over certain length reduce size of text */}
                  <div className={`provider-price ${tripRecievedPrice.length > 5 ? 'smaller' : ''}`}>
                    <text> {tripRecievedPrice} </text>
                  </div>
                  <div className="pointer-arrow-container">
                    <img className="pointer-arrow" src={pointer} />
                  </div>
                </a>
              )}
            </a>
            <a className="provider-card-wrapper">
              {/* show the result of the gethotelprice function*/}
              {isLoading ? (
                <div className="provider-card">
                  <div className="spinner-container" role="status">
                    <ThreeDots
                      color="#282c34"
                      width="60"
                    />
                  </div>
                </div>
              ) : (
                <a className="provider-card" href={hotelsComRecievedUrl} target="_blank">
                  <div className="provider-logo-container">
                    <img className="provider-image" src={hotelsComLogo} alt="hotels.com logo" />
                  </div>
                  <div className="provider-name">
                    <text> Hotels.com </text>
                  </div>
                  <div className={`provider-price ${hotelsComRecievedPrice.length > 5 ? 'smaller' : ''}`}>
                    <text> {hotelsComRecievedPrice} </text>
                  </div>
                  <div className="pointer-arrow-container">
                    <img className="pointer-arrow" src={pointer} />
                  </div>
                </a>
              )}
            </a>
            <a className="provider-card-wrapper">
              {/* show the result of the gethotelprice function*/}
              {isLoading ? (
                <div className="provider-card">
                  <div className="spinner-container" role="status">
                    <ThreeDots
                      color="#282c34"
                      width="60"
                    />
                  </div>
                </div>
              ) : (
                <a className="provider-card" href={expediaRecievedUrl} target="_blank">
                  <div className="provider-logo-container">
                    <img className="provider-image" src={expediaLogo} alt="hotels.com logo" />
                  </div>
                  <div className="provider-name">
                    <text> Expedia </text>
                  </div>
                  <div className={`provider-price ${expediaRecievedPrice.length > 5 ? 'smaller' : ''}`}>
                    <text> {expediaRecievedPrice} </text>
                  </div>
                  <div className="pointer-arrow-container">
                    <img className="pointer-arrow" src={pointer} />
                  </div>
                </a>
              )}
            </a>
            <div className="provider-card-wrapper">
              <a className="provider-card">
                <div className="provider-logo-container">
                </div>
                <div className="provider-name">
                  <text> {hotelRoom}, {arrivalDate} </text>
                </div>
                <div className="provider-price">
                </div>
                <div className="pointer-arrow-container">
                </div>
              </a>
            </div>
            <a className="provider-card-wrapper">
              <a className="provider-card">
                <div className="provider-logo-container">
                </div>
                <div className="provider-name">
                  <text> {departureDate} </text>
                </div>
                <div className="provider-price">
                </div>
                <div className="pointer-arrow-container">
                </div>
              </a>
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
