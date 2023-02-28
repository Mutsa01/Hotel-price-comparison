// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functional
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
// This function will return the price of the first result on trip.com for the given hotel name
async function getPrice(hotelName) {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1700, height: 800 }, args: ['--start-maximized'], executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage();

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

    //read the price within the class real labelColor
    await page.waitForSelector('.real.labelColor', { timeout: 20000 });
    const price = await page.evaluate(() => document.querySelector('.real.labelColor').innerText);
    console.log(price);

    await browser.close();
    return price;
}

module.exports = {getPrice}