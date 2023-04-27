import { DOMMessage, DOMMessageResponse } from '../types';

const messagesFromReactAppListener = (msg: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {
  console.log('[content.js]. Message received', msg);

  // Check the current URL to determine which site we are on
  const currentUrl = window.location.href;

  if (window.location.href.includes('marriott')) {
    // Selector queries for Marriott website
    const tripDates = document.querySelectorAll(".m-date-text") as NodeListOf<HTMLElement>;

    const response: DOMMessageResponse = {
      //get hotelname from element 
      hotelName: (document.querySelector("[itemprop='name']") as HTMLElement).innerText,

      //get hotel room type from element 
      hotelRoom: (document.querySelector(".l-room-type-label") as HTMLElement).innerText,

      //get hotelPrice 
      hotelPrice: (document.querySelector(".js-total-points-rate-value") as HTMLElement).innerText,

      //get arrival date from element tripDates[0]
      arrivalDate: tripDates[0].innerText.trim(),

      //get departure date from element tripDates[1]
      departureDate: tripDates[1].innerText.trim()
    };

    console.log('[content.js]. Message response', response);

    sendResponse(response)
  } else if (window.location.href.includes('ihg')) {
    console.log('ihg.com');

    // format the date string returned fromn the DOM
    const tripDates = (document.querySelector('[data-testid="dates-info"]') as HTMLElement).innerText;
    const [checkInDate, checkOutDate] = formatDate(tripDates);

    const response: DOMMessageResponse = {
      //get hotelname from element with class brand-name
      hotelName: (document.querySelector(".brand-name") as HTMLElement).innerText.trim(),

      //get hotel price 
      hotelPrice: (document.querySelector('[data-testid="total-price"]') as HTMLElement).innerText.trim(),
      
      //get hotel room type
      hotelRoom: (document.querySelector('[data-testid="room-type-info"]') as HTMLElement).innerText.trim(),

      // return the formatted dates
      arrivalDate: checkInDate.trim(),

      departureDate: checkOutDate.trim()

    };

    console.log('[content.js]. Message response', response);

    sendResponse(response)
  }
};

function formatDate(dateStr: string) {
    // Split the date string into its components
    const [month, dateRange, year] = dateStr.split(" ");
    const [startDate, endDate] = dateRange.split("-");
  
    // Parse the start and end dates
    const startDateObj = new Date(`${month} ${startDate}, ${year}`);
    const endDateObj = new Date(`${month} ${endDate}, ${year}`);
  
    // Format the start and end dates as strings
    const startDateFormatted = startDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const endDateFormatted = endDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  
    // Return the formatted dates as an array
    return [startDateFormatted, endDateFormatted];
}


/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
