export type DOMMessage = {
    type: 'GET_DOM'
  }
  
  export type DOMMessageResponse = {
    title: string;
    headlines: string[];
    hotelName: string;
    hotelRoom: string;
    hotelPrice: string; 
  }