// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functional
const puppeteer = require('puppeteer-extra');
const stringSimilarity = require('string-similarity');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


// This function will return the price of the a hotel for the given hotel name and room
async function getExpediaPrice(hotelName, roomType, checkInDate, checkOutDate) {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 700, height: 775 }, args: ['--start-maximized'], executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

    const checkIn = formatDate(checkInDate);
    const checkOut = formatDate(checkOutDate);

    const page = await browser.newPage();

    // Go to the expedia website and search for the given hotel
    await page.goto('https://expedia.co.uk/');

    //click search field of class uitk-fake-input uitk-form-field-trigger
    await page.waitForSelector('.uitk-fake-input.uitk-form-field-trigger', { timeout: 5000 });
    await page.click('.uitk-fake-input.uitk-form-field-trigger');

    //type hotel name in field of class uitk-field-input uitk-typeahead-input uitk-typeahead-input-v2
    await page.waitForSelector('.uitk-field-input.uitk-typeahead-input.uitk-typeahead-input-v2', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.type('.uitk-field-input.uitk-typeahead-input.uitk-typeahead-input-v2', hotelName);
    await new Promise(resolve => setTimeout(resolve, 2000));

    //click on the first suggestion of class uitk-action-list-item-content
    await page.waitForSelector('button[data-stid="location-field-destination-result-item-button"]', { timeout: 5000 });
    await page.click('button[data-stid="location-field-destination-result-item-button"]');

    await new Promise(resolve => setTimeout(resolve, 2000));

    //click calander button of class uitk-faux-input uitk-form-field-trigger
    await page.waitForSelector('#d1-btn', { timeout: 5000 });
    await page.click('#d1-btn');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // click the date with the label of the date in the form dd month yyyy
    await page.waitForSelector(`button[data-day="${checkIn[0]}"][aria-label*="${checkIn[1]}"]`);
    await page.click(`button[data-day="${checkIn[0]}"][aria-label*="${checkIn[1]}"]`);

    await new Promise(resolve => setTimeout(resolve, 400));

    await page.waitForSelector(`button[data-day="${checkOut[0]}"][aria-label*="${checkOut[0]}"]`);
    await page.click(`button[data-day="${checkOut[0]}"][aria-label*="${checkOut[1]}"]`);

    //click done button of class uitk-button uitk-button-large uitk-button-fullWidth uitk-button-has-text uitk-button-primary uitk-button-floating-full-width
    await page.waitForSelector('.uitk-button.uitk-button-large.uitk-button-fullWidth.uitk-button-has-text.uitk-button-primary.uitk-button-floating-full-width', { timeout: 5000 });
    await page.click('.uitk-button.uitk-button-large.uitk-button-fullWidth.uitk-button-has-text.uitk-button-primary.uitk-button-floating-full-width');

    //click the search button with id await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="submit-button"]', { timeout: 5000 });
    await page.click('[data-testid="submit-button"]');

    //click the first hotel of class uitk-link uitk-link-align-right uitk-link-layout-default uitk-link-medium
    await page.waitForSelector('.uitk-link.uitk-link-align-right.uitk-link-layout-default.uitk-link-medium', { timeout: 15000 });
    await page.click('.uitk-link.uitk-link-align-right.uitk-link-layout-default.uitk-link-medium');
    // await new Promise(resolve => setTimeout(resolve, 4000));

    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    const newPage = await newPagePromise;

    await new Promise(resolve => setTimeout(resolve, 4000));

    const hotelUrl = newPage.url();
    console.log(hotelUrl);

    await new Promise(resolve => setTimeout(resolve, 400));
    newPage.evaluate(() => { window.scrollTo(0, window.innerHeight) });

    //wait for the class room-name to be loaded, retrying a few times if necessary
    let retries = 3;
    while (retries > 0) {
        try {
            await newPage.waitForSelector('.uitk-heading.uitk-heading-6', { timeout: 15000 });
            break;
        } catch (error) {
            retries--;
            await newPage.reload();
            console.log(`Error: ${error.message}. Retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const roomData = await newPage.evaluate(() => {

        const rooms = [];

        roomNamesList = document.querySelectorAll('.uitk-heading.uitk-heading-6');
        roomPricesList = document.querySelectorAll('.uitk-text.uitk-type-600.uitk-type-bold.uitk-text-emphasis-theme');

        for (let i = 0; i < roomNamesList.length; i++) {
            rooms.push({ name: roomNamesList[i].innerText.trim(), price: roomPricesList[i].textContent.trim() });
        }
        return rooms;
    });

    console.log(roomData);
    // await new Promise(resolve => setTimeout(resolve, 40000));


    //find which room type matches the room type passed in the function
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
    return { price, hotelUrl };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const year = date.getFullYear();
    return [`${day}`, `${month} ${year}`];
}

module.exports = { getExpediaPrice };
