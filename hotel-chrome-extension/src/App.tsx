import React from 'react';
import logo from './new_logo.svg';
import exit from './grey_exit_icon.svg';
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
      
    </div>
  );
}

export default App;
