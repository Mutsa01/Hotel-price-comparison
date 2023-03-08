import { DOMMessage, DOMMessageResponse } from '../types';

const messagesFromReactAppListener = (msg: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {
  console.log('[content.js]. Message received', msg);

  const response: DOMMessageResponse = {
    title: document.title,
    headlines: Array.from(document.getElementsByTagName<"h1">("h1")).map(h1 => h1.innerText),
    //get hotelname from element <span itemprop="name"></span>
    hotelName: (document.querySelector("[itemprop='name']") as HTMLElement).innerText,

    //get hotel description from element <h2 class="l-room-type-label l-margin-top-double t-extend-h3 ">  </h2>
    hotelRoom: (document.querySelector(".l-room-type-label") as HTMLElement).innerText,
  
    //get hotelPrice from <span class="t-font-weight-bold t-font-mll t-line-height-xxl js-total-points-rate-value js-cash-and-point">  499.00  </span>
    hotelPrice: (document.querySelector(".js-total-points-rate-value") as HTMLElement).innerText
  };

  console.log('[content.js]. Message response', response);

  sendResponse(response)
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);