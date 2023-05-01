import React from "react";
import "./cssFiles/App.css";
import "./cssFiles/index.css";
import "./cssFiles/extras.css";
import "./cssFiles/recents.css";
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
import yellowSearch from './icons/search_icon_yellow.svg';
import greyHouse from './icons/house_icon_grey.svg';
import pointer from './icons/pointer-arrow.svg';
import { Link } from "react-router-dom";
import greyPlus from "./icons/plus_grey.svg";

import getHotelPrice from "./App";

import App from "./App";
import Extras from "./extras";


interface Props {
    getHotelPrice: (hotelName: string, hotelRoom: string, arrivalDate: string, departureDate: string) => void;
}

function Recent(props: Props) {

    const [showHome, setShowHome] = React.useState(false);
    const [showExtras, setShowExtras] = React.useState(false);

    const [recentSearches, setRecentSearches] = React.useState<{ hotelName: string; hotelRoom: string; arrivalDate: string; departureDate: string; }[]>([]);

    const [hotelName, setHotelName] = React.useState("");
    const [hotelRoom, setHotelRoom] = React.useState("");
    const [arrivalDate, setArrivalDate] = React.useState("");
    const [departureDate, setDepartureDate] = React.useState("");

    // function to set the state variables based on the selected hotel
    function setSelectedHotel(hotel: { hotelName: React.SetStateAction<string>; hotelRoom: React.SetStateAction<string>; arrivalDate: React.SetStateAction<string>; departureDate: React.SetStateAction<string>; }) {
        setHotelName(hotel.hotelName);
        setHotelRoom(hotel.hotelRoom);
        setArrivalDate(hotel.arrivalDate);
        setDepartureDate(hotel.departureDate);
        setShowHome(!showHome);
    }

    const handleHomeClick = () => {
        setShowHome(!showHome);
    };

    const handlePlusClick = () => {
        setShowExtras(!showExtras);
    };

    React.useEffect(() => {
        chrome.storage.local.get(null, function (items) {
            // filter out the keys that are not the uuids
            const keys = Object.keys(items).filter(key => key.length > 10);

            // sort the items by timestamp
            const sortedItems = keys.map(key => items[key]).sort((a, b) => b.timestamp - a.timestamp);
            const lastFiveItems = sortedItems.slice(0, 5);
            const searchData: { hotelName: string; hotelRoom: string; arrivalDate: string; departureDate: string; }[] = [];
            
            // push the data to the searchData array
            lastFiveItems.forEach(item => {
                searchData.push({
                    hotelName: item.hotel_name,
                    hotelRoom: item.hotel_room,
                    arrivalDate: item.arrival_date,
                    departureDate: item.departure_date
                });
            });

            console.log(searchData);
            setRecentSearches(searchData);
        });
    }, []);



    return (
        <div>
            {showHome ? (
                // pass the selected hotel to the App component
                <App
                    _hotelName={hotelName}
                    _hotelRoom={hotelRoom}
                    _arrivalDate={arrivalDate}
                    _departureDate={departureDate}
                />
            ) : showExtras ? (
                <Extras />
            ) : (
                <>
                    <body>
                        <div className="content-container">
                            <div className="providers-list">
                                {/* Display recently found searches */}
                                {[...Array(5)].map((_, index) => (
                                    // initiate search with the selected hotel
                                    <a className="recents-card" onClick={() => setSelectedHotel(recentSearches[index])}>
                                        <div className="search-text-wrapper">
                                            {recentSearches.length > index && (
                                                <>
                                                    <div className="search-text">
                                                        Hotel Name: {recentSearches[index].hotelName}
                                                    </div>
                                                    <div className="search-text">
                                                        Room Type: {recentSearches[index].hotelRoom}
                                                    </div>
                                                    <div className="search-text">
                                                        Check-In: {recentSearches[index].arrivalDate}
                                                    </div>
                                                    <div className="search-text">
                                                        Check-Out: {recentSearches[index].departureDate}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="pointer-arrow-container">
                                            <img className="pointer-arrow" src={pointer} />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="bottom-nav-container">
                                <img src={yellowSearch} className="bottom-nav-item" alt="search icon" />
                                <img src={greyHouse} className="bottom-nav-item" alt="home icon" onClick={handleHomeClick} />
                                <img src={greyPlus} className="bottom-nav-item" alt="plus icon" onClick={handlePlusClick} />
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
