import React from "react";
import "./cssFiles/App.css";
import "./cssFiles/index.css";
import "./cssFiles/extras.css";
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
import search from './icons/search_icon.svg';
import house from './icons/house_icon1.svg';
import plus from './icons/plus_grey.svg';
import pointer from './icons/pointer-arrow.svg';
import { Link } from "react-router-dom";
import plusYellow from "./icons/plus_yellow.svg";

import App from "./App";
import Recent from "./recents";
import Extras from "./extras";

function SearchError() {


    const [showExtras, setShowExtras] = React.useState(false);
    const [showRecents, setShowRecents] = React.useState(false);

    const handlePlusClick = () => {
        setShowExtras(!showExtras);
    };

    const handleRecentsClick = () => {
        setShowRecents(!showRecents);
    };

    return (
        <div>
            {showExtras ? (
                <Extras />
            ) : showRecents ? (
                <Recent getHotelPrice={function (hotelName: string, hotelRoom: string, arrivalDate: string, departureDate: string): void {
                    throw new Error("Function not implemented.");
                }} />
            ) : (
                <>
                    <body>
                        <div className="content-container">
                            <div className="providers-list">
                                <div className="error-text-wrapper">
                                <text className="option-text">
                                    Hmmm That Didn't Work!
                                </text>
                                <br></br>
                                <text className="option-text-smaller">
                                    Please make sure you have selected all the necessary fields from a valid provider.
                                </text>
                                </div>
                            </div>
                            <div className="bottom-nav-container">
                                <img src={search} className="bottom-nav-item" alt="search icon" onClick={handleRecentsClick} />
                                <img src={house} className="bottom-nav-item" alt="home icon" />
                                {/* <Link to="/static/js/App.tsx"> */}
                                <img src={plus} className="bottom-nav-item" alt="plus icon" onClick={handlePlusClick} />
                            </div>
                        </div>
                    </body>
                </>
            )}
        </div>
    );
}

export default SearchError;
