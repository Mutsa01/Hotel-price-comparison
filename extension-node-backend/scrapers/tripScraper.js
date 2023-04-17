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
async function getTripPrice(hotelName, roomType, checkInDate, checkOutDate) {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1700, height: 800 }, args: ['--start-maximized'], executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage();

    let price = null;

    const checkIn = formatDate(checkInDate);
    const checkOut = formatDate(checkOutDate);

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

    await new Promise(resolve => setTimeout(resolve, 400));

    // submit search by clicking on the class associative-item hover
    await page.waitForSelector('.search-btn-wrap', { timeout: 5000 });
    await page.click('.search-btn-wrap');

    await new Promise(resolve => setTimeout(resolve, 1400));
    //click on the button to check availability
    await page.waitForSelector('.btn-bottom', { timeout: 18000 });
    await page.click('.btn-bottom');

    //open navigate to the new tab created
    let newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    // await page.click('.btn-bottom');
    let newPage = await newPagePromise;

    await new Promise(resolve => setTimeout(resolve, 4000));

    let calRetries = 3;
    while (calRetries > 0) {
        try {
            await newPage.waitForSelector('.time-tab', { timeout: 15000 });
            await newPage.click('.time-tab')
            break;
        } catch (error) {
            calRetries--;
            console.log(`Error: ${error.message}. Retrying calander...`);
            await page.waitForSelector('.btn-bottom', { timeout: 18000 });
            await page.click('.btn-bottom');

            //open navigate to the new tab created
            newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
            // await page.click('.btn-bottom');
            newPage = await newPagePromise;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    //if the selector could not be found after multiple retries, throw an error
    if (calRetries === 0) {
        // throw error
        await browser.close();
        throw new Error('error while scraping trip.com');
    }

    //click on the check in date
    await page.evaluate((checkIn) => {
        console.log(checkIn);
        calMonths = document.querySelectorAll('.c-calendar-month');
        // check both calanders for the check in date
        for (let i = 0; i < calMonths.length; i++) {
            const month = calMonths[i].querySelector('.c-calendar-month__title').innerText.trim();
            if (month == checkIn[1]) {
                console.log(month, checkIn[1]);
                const days = calMonths[i].querySelectorAll('.is-allow-hover');
                console.log(days);
                // Iterate over the array and click on the element with the correct day
                for (let i = 0; i < days.length; i++) {
                    // Get text from the element days[i]
                    const day = days[i].innerText.trim();
                    console.log(day);
                    if (day === checkIn[0]) {
                        days[i].click()
                        checkinSelected = true;
                        break;
                    }
                }
            }
            console.log(month);
        }
        return;
    }, checkIn);

    // click on the check out date
    await page.evaluate((checkOut) => {
        console.log(checkOut);
        calMonths = document.querySelectorAll('.c-calendar-month');
        // check both calanders for the check out date
        for (let i = 0; i < calMonths.length; i++) {
            const month = calMonths[i].querySelector('.c-calendar-month__title').innerText.trim();
            if (month == checkOut[1]) {
                console.log(month, checkOut[1]);
                const days = calMonths[i].querySelectorAll('.is-allow-hover');
                console.log(days);
                // Iterate over the array and click on the element with the correct day
                for (let i = 0; i < days.length; i++) {
                    // Get text from the element days[i]
                    const day = days[i].innerText.trim();
                    console.log(day);
                    if (day === checkOut[0]) {
                        days[i].click()
                        checkoutSelected = true;
                        break;
                    }
                }
            }
            console.log(month);
        }
        return;
    }, checkOut);

    await new Promise(resolve => setTimeout(resolve, 1000));
    // submit search by clicking on the class associative-item hover
    await newPage.waitForSelector('.search-btn-wrap', { timeout: 5000 });
    await newPage.click('.search-btn-wrap');

    await new Promise(resolve => setTimeout(resolve, 1000));

    //wait for the class room-name to be loaded, retrying a few times if necessary
    let retries = 3;
    while (retries > 0) {
        try {
            await newPage.waitForSelector('.room-name', { timeout: 5000 });
            break;
        } catch (error) {
            retries--;
            console.log(`Error: ${error.message}. Retrying...`);

            await new Promise(resolve => setTimeout(resolve, 1000));
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

    console.log(roomData);

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

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const year = date.getFullYear();
    return [`${day}`, `${month} ${year}`];
}

module.exports = { getTripPrice }