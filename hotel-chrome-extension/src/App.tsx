import React from 'react';
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
import search from './icons/search_icon.svg';
import house from'./icons/house_icon1.svg';
import plus from './icons/plus_grey.svg';
import './App.css';

function App() {
  const handleExitClick = () => {
    window.close();
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span className="company-name">
          Cosmic Rates
        </span>
        <div className="exit-box" onClick={handleExitClick}>
          <img src={exit} className='exit-icon' alt='exit icon'/>
        </div>
      </header>
      <body>
        <div className="bottom-nav-container">
          <img src={search} className="bottom-nav-item" alt="search icon" />
          <img src={house} className="bottom-nav-item" alt="home icon" />
          <img src={plus} className="bottom-nav-item" alt="plus icon" />
        </div>
      </body>
    </div>
  );
}

export default App;
