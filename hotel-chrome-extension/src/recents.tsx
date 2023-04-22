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



    const handleHomeClick = () => {
        setShowHome(!showHome);
    };

    const handlePlusClick = () => {
        setShowExtras(!showExtras);
    };

    const initiateSearch = (i: number) => {
        // open App.tsx and initiate rate search
        setShowHome(!showHome);
        props.getHotelPrice(recentSearches[i].hotelName, recentSearches[i].hotelRoom, recentSearches[i].arrivalDate, recentSearches[i].departureDate)
    };

    // Retrieve data from the storage
    React.useEffect(() => {
        chrome.storage.local.get(null, function (items) {
            const itemsArray = Object.entries(items);
            const lastFiveItems = itemsArray.slice(-5);

            const searchData: { hotelName: string; hotelRoom: string; arrivalDate: string; departureDate: string; }[] = [];
            lastFiveItems.forEach(([key, value]) => {

                searchData.push({ hotelName: value.hotel_name, hotelRoom: value.hotel_room, arrivalDate: value.arrival_date, departureDate: value.departure_date });

            });

            console.log(searchData);
            console.log(searchData[4].hotelName);

            setRecentSearches(searchData);

        });
    }, []);



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
                                <a className="recents-card" onClick={() => initiateSearch(4)}>
                                    <div className="search-text-wrapper">
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Hotel Name: {recentSearches[4].hotelName}</text>}
                                        </div>
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Room Type: {recentSearches[4].hotelRoom}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-In: {recentSearches[4].arrivalDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-In: {recentSearches[4].arrivalDate}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-Out: {recentSearches[4].departureDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-Out: {recentSearches[4].departureDate}</text>}
                                        </div>
                                    </div>
                                    <div className="pointer-arrow-container">
                                        <img className="pointer-arrow" src={pointer} />
                                    </div>
                                </a>
                                <a className="recents-card" onClick={() => initiateSearch(3)}>
                                    <div className="search-text-wrapper">
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Hotel Name: {recentSearches[3].hotelName}</text>}
                                        </div>
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Room Type: {recentSearches[3].hotelRoom}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-In: {recentSearches[4].arrivalDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-In: {recentSearches[3].arrivalDate}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-Out: {recentSearches[4].departureDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-Out: {recentSearches[3].departureDate}</text>}
                                        </div>
                                    </div>
                                    <div className="pointer-arrow-container">
                                        <img className="pointer-arrow" src={pointer} />
                                    </div>
                                </a>

                                <a className="recents-card" onClick={() => initiateSearch(2)}>
                                    <div className="search-text-wrapper">
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Hotel Name: {recentSearches[2].hotelName}</text>}
                                        </div>
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Room Type: {recentSearches[2].hotelRoom}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-In: {recentSearches[4].arrivalDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-In: {recentSearches[2].arrivalDate}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-Out: {recentSearches[4].departureDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-Out: {recentSearches[2].departureDate}</text>}
                                        </div>
                                    </div>
                                    <div className="pointer-arrow-container">
                                        <img className="pointer-arrow" src={pointer} />
                                    </div>
                                </a>

                                <a className="recents-card" onClick={() => initiateSearch(1)}>
                                    <div className="search-text-wrapper">
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Hotel Name: {recentSearches[1].hotelName}</text>}
                                        </div>
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Room Type: {recentSearches[1].hotelRoom}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-In: {recentSearches[4].arrivalDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-In: {recentSearches[1].arrivalDate}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-Out: {recentSearches[4].departureDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-Out: {recentSearches[1].departureDate}</text>}
                                        </div>
                                    </div>
                                    <div className="pointer-arrow-container">
                                        <img className="pointer-arrow" src={pointer} />
                                    </div>
                                </a>

                                <a className="recents-card" onClick={() => initiateSearch(0)}>
                                    <div className="search-text-wrapper">
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Hotel Name: {recentSearches[0].hotelName}</text>}
                                        </div>
                                        <div className="search-text">
                                            {recentSearches.length > 4 && <text> Room Type: {recentSearches[0].hotelRoom}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-In: {recentSearches[4].arrivalDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-In: {recentSearches[0].arrivalDate}</text>}
                                        </div>
                                        <div className="search-text">
                                            {/* <text> Check-Out: {recentSearches[4].departureDate} </text> */}
                                            {recentSearches.length > 4 && <text> Check-Out: {recentSearches[0].departureDate}</text>}
                                        </div>
                                    </div>
                                    <div className="pointer-arrow-container">
                                        <img className="pointer-arrow" src={pointer} />
                                    </div>
                                </a>
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
