// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functional
const puppeteer = require('puppeteer-extra');
const stringSimilarity = require('string-similarity');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// delay function to wait before executing the next line of code
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
// This function will return the price of the first result on trip.com for the given hotel name
async function getTripPrice(hotelName, roomType) {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1700, height: 800 }, args: ['--start-maximized'], executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage();

    let price = null;

    // Go to the trip.com website and search for the given hotel
    await page.goto('https://uk.trip.com/?locale=en-gb');

    //click on the class fi fi-hotel - this is the hotel search button
    await page.waitForSelector('.fi.fi-hotel', { timeout: 5000 });
    await page.click('.fi.fi-hotel');

    //type in the class show-hightlight the hotel name
    await page.waitForSelector('.show-hightlight', { timeout: 5000 });
    await page.type('.show-hightlight', hotelName);

    //select the suggested hotel by clicking on the class associative-item hover- this is the hotel first suggestion
    await page.waitForSelector('.associative-item.hover', { timeout: 10000 });
    await page.click('.associative-item.hover');

    //submit search by clicking on the class associative-item hover
    await page.waitForSelector('.search-btn-wrap', { timeout: 5000 });
    await page.click('.search-btn-wrap');

    //click on the button to check availability
    await page.waitForSelector('.btn-bottom', { timeout: 8000 });
    await page.click('.btn-bottom');

    //open navigate to the new tab created
    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    await page.click('.btn-bottom');
    const newPage = await newPagePromise;

    //wait for the class room-name to be loaded, retrying a few times if necessary
    let retries = 3;
    while (retries > 0) {
        try {
            await newPage.waitForSelector('.room-name', { timeout: 5000 });
            break;
        } catch (error) {
            retries--;
            console.log(`Error: ${error.message}. Retrying...`);
            // await newPage.goto(newPage.url(), { waitUntil: 'load' });
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    //if the selector could not be found after multiple retries, throw an error
    if (retries === 0) {
        // throw error
        await browser.close();
        throw new Error('error while scraping trip.com');
    }

    const hotelUrl = newPage.url();
    // console.log(hotelUrl);

    const roomData = await newPage.evaluate(() => {
        const avaiableRooms = document.querySelectorAll('.room-card-item');

        //for each room card on the page ith the class name room-card-item, retrieve the room name and price
        const rooms = [];
        for (let i = 0; i < avaiableRooms.length; i++) {
            const roomName = avaiableRooms[i].querySelector('.room-name').innerText.trim();
            const roomPrice = avaiableRooms[i].querySelector('.price-real').innerText.trim();
            const bedType = avaiableRooms[i].querySelector('.dash-line').innerText.trim();
            rooms.push({ name: roomName, price: roomPrice, bed: bedType });
        }
        console.log(rooms);
        return rooms;
    });


    //find which room type matches the room type passed in the function
    const roomMatch = stringSimilarity.findBestMatch(roomType, roomData.map(room => room.name));

    //find the index of the room type that matches the room type passed in the function
    if (roomMatch.bestMatch.rating < 0.3) {
        return { price: 'No rooms available', hotelUrl }
    } else {
        const roomIndex = roomData.findIndex(room => room.name === roomMatch.bestMatch.target);
        price = roomData[roomIndex].price;
        console.log(price);
    }


    await browser.close();
    // console.log(hotelUrl);
    return { price, hotelUrl };
}

module.exports = { getTripPrice }