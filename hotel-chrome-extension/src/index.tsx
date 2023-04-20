import React from 'react';
import ReactDOM from 'react-dom/client';
import './cssFiles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoadingIndicator from './loadingIndicator';
import { Route, Routes } from 'react-router-dom';
import Extras from './extras';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <LoadingIndicator />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
