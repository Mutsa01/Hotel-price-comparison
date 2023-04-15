import { DOMMessage, DOMMessageResponse } from '../types';

const messagesFromReactAppListener = (msg: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {
  console.log('[content.js]. Message received', msg);

  // Check the current URL to determine which site we are on
  const currentUrl = window.location.href;

  if (window.location.href.includes('marriott.com')) {
    // Selector queries for Marriott website
    const tripDates = document.querySelectorAll(".m-date-text") as NodeListOf<HTMLElement>;

    const response: DOMMessageResponse = {
      //get hotelname from element <span itemprop="name"></span>
      hotelName: (document.querySelector("[itemprop='name']") as HTMLElement).innerText,

      //get hotel description from element <h2 class="l-room-type-label l-margin-top-double t-extend-h3 ">  </h2>
      hotelRoom: (document.querySelector(".l-room-type-label") as HTMLElement).innerText,

      //get hotelPrice from <span class="t-font-weight-bold t-font-mll t-line-height-xxl js-total-points-rate-value js-cash-and-point">  499.00  </span>
      hotelPrice: (document.querySelector(".js-total-points-rate-value") as HTMLElement).innerText,

      //get arrival date from element tripDates[0]
      arrivalDate: tripDates[0].innerText.trim(),

      //get departure date from element tripDates[1]
      departureDate: tripDates[1].innerText.trim()
    };

    console.log('[content.js]. Message response', response);

    sendResponse(response)
  } else if (currentUrl.includes('booking.com')) {

    console.log('booking.com');
  };

  // console.log('[content.js]. Message response', response);

  // sendResponse(response)
}


/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
