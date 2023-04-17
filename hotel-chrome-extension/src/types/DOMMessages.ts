export type DOMMessage = {
    type: 'GET_DOM'
  }
  
  export type DOMMessageResponse = {
    hotelName: string;
    hotelRoom: string;
    hotelPrice: string; 
    arrivalDate: string;
    departureDate: string;
  }