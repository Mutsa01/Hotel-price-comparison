import React from "react";
import "./cssFiles/App.css";
import "./cssFiles/index.css";
import "./cssFiles/extras.css";
import "./cssFiles/providers.css"
import search from './icons/search_icon.svg';
import greyHouse from './icons/house_icon_grey.svg';
import pointer from './icons/pointer-arrow.svg';
import plusYellow from "./icons/plus_yellow.svg";
import tripLogo from './providerLogos/trip-com-logo.jpeg';
import hotelsComLogo from './providerLogos/hotels-com-logo.jpg';
import expediaLogo from './providerLogos/expedia-logo.png';
import agodaLogo from './providerLogos/agoda-logo.jpg';
import ihgLogo from './providerLogos/IHG-logo.png';
import marriottLogo from './providerLogos/Marriott-Logo.png';


import App from "./App";
import Recent from "./recents";

function Providers() {

    const [showHome, setShowHome] = React.useState(false);
    const [showRecents, setShowRecents] = React.useState(false);


    const handleHomeClick = () => {
        setShowHome(!showHome);
    };

    const handleRecentsClick = () => {
        setShowRecents(!showRecents);
    };

    return (
        <div>
            {showHome ? (
                <App
                    _hotelName={""}
                    _hotelRoom={""}
                    _arrivalDate={""}
                    _departureDate={""}
                />
            ) : showRecents ? (
                <Recent getHotelPrice={function (hotelName: string, hotelRoom: string, arrivalDate: string, departureDate: string): void {
                    throw new Error("Function not implemented.");
                }} />
            ) : (
                <>
                    <body>
                        <div className="content-container">
                            <div className="provider-icons-wrapper">
                                <div className="ball" >
                                    <img src={tripLogo} alt="trip.com logo" />
                                </div>
                                <div className="ballA">
                                    <img src={hotelsComLogo} alt="hotels.com logo" />
                                </div>
                                <div className="ballB">
                                    <img src={expediaLogo} alt="hotels.com logo" />
                                </div>
                                <div className="ballC">
                                    <img src={agodaLogo} alt="agoda logo" />
                                </div>
                                <div className="ballD">
                                    <img src={ihgLogo} alt="ihg logo" />
                                </div>
                                <div className="ballE">
                                    <img src={marriottLogo} alt="marriott logo" />
                                </div>
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

export default Providers;
