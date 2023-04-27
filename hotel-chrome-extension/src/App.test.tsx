import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App
    _hotelName={""} 
    _hotelRoom={""} 
    _arrivalDate={""} 
    _departureDate={""} 
  />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
