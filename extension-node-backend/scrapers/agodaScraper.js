// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functional
const puppeteer = require('puppeteer-extra');
const stringSimilarity = require('string-similarity');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


// This function will return the price of the first result on trip.com for the given hotel name
async function getAgodaPrice(hotelName, roomType, checkInDate, checkOutDate) {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1700, height: 800 }, args: ['--start-maximized'], executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

    const checkIn = formatDate(checkInDate);
    const checkOut = formatDate(checkOutDate);

    const page = await browser.newPage();

    console.log(checkIn, checkOut);

    // Go to the trip.com website and search for the given hotel
    await page.goto('https://www.agoda.com/en-gb/');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // close pop up
    await page.waitForSelector('.ab-close-button', { timeout: 15000 });
    await page.click('.ab-close-button');

    await new Promise(resolve => setTimeout(resolve, 400));
    page.evaluate(() => { window.scrollTo(0, window.innerHeight) });

    // type hotel name
    await page.waitForSelector('#textInput', { timeout: 15000 });
    await page.type('#textInput', hotelName);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // select first hotel from list
    await page.waitForSelector('.Suggestion.LocationSearch.Suggestion__categoryName', { timeout: 15000 });
    await page.click('.Suggestion.LocationSearch.Suggestion__categoryName');

    await new Promise(resolve => setTimeout(resolve, 500));

    // click on check in date
    await page.waitForSelector(`[data-selenium-date="${checkIn}"]`, { timeout: 5000 });
    await page.click(`[data-selenium-date="${checkIn}"]`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // select the element to hover over
    const element = await page.$(`[data-selenium-date="${checkOut}"]`);

    // hover over the element
    await element.hover();

    // wait for a short period of time to ensure the hover effect is visible
    await page.waitForTimeout(1000);

    // click on the element
    await element.click();

    await new Promise(resolve => setTimeout(resolve, 2000));
    // click on search button
    await page.waitForSelector(`[data-selenium="searchButton"]`, { timeout: 5000 });
    await page.click('[data-selenium="searchButton"]');

    // click on search button
    await page.waitForSelector(`[data-selenium="searchButton"]`, { timeout: 5000 });
    await page.click('[data-selenium="searchButton"]');

    // click this class Itemstyled__Item-sc-12uga7p-0 ewNxOO PropertyCard__Section PropertyCard__Section--propertyInfo
    await page.waitForSelector('.Itemstyled__Item-sc-12uga7p-0.ewNxOO.PropertyCard__Section.PropertyCard__Section--propertyInfo', { timeout: 15000 });
    await page.click('.Itemstyled__Item-sc-12uga7p-0.ewNxOO.PropertyCard__Section.PropertyCard__Section--propertyInfo');


    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    const newPage = await newPagePromise;


    await new Promise(resolve => setTimeout(resolve, 5000));

    hotelUrl = await newPage.url();

    // click on button with class Box-sc-kv6pi1-0 fMRRsF
    await newPage.waitForSelector('.Box-sc-kv6pi1-0.fMRRsF', { timeout: 15000 });
    await newPage.click('.Box-sc-kv6pi1-0.fMRRsF');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const roomData = await newPage.evaluate(() => {
        const rooms = [];
        document.querySelectorAll('.MasterRoom').forEach(async (element) => {
            const roomName = await element.querySelector('.MasterRoom__HotelName').innerText.trim();
            // get price of room
            const roomPrice = await element.querySelector('strong[data-ppapi="room-price"]').innerText.trim();
            console.log(roomName);
            rooms.push({name: roomName, price: '£'+roomPrice});
        });
        return rooms;
    });

    console.log(roomData);

    // find the room type that is most similar to the given room type
    const roomMatch = stringSimilarity.findBestMatch(roomType, roomData.map(room => room.name));

    //find the index of the room type that matches the room type passed in the function
    if (roomMatch.bestMatch.rating < 0.3) {
        await browser.close();
        return { price: 'No rooms available', hotelUrl }
    } else {
        const roomIndex = roomData.findIndex(room => room.name === roomMatch.bestMatch.target);
        price = roomData[roomIndex].price;
        console.log(price);
    }

    await browser.close();
    return {price, hotelUrl}
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

module.exports = {getAgodaPrice};
