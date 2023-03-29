const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
const bodyParser = require('body-parser');
const { getTripPrice } = require('./scrapers/tripScraper');
const { getHotelsPrice } = require('./scrapers/hotelsScraper');

// Enable CORS and bodyParser middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/newEndpoint', (req, res) => {
  res.send('This is my new endpoint!')
})

app.get('/get-hotel-price/:hotelName/:hotelRoom/:arrivalDate/:departureDate', async (req, res) => {
  const hotelName = req.params.hotelName;
  const hotelRoom = req.params.hotelRoom;
  const arrivalDate = req.params.arrivalDate;
  const departureDate = req.params.departureDate;
  console.log(`Getting price for hotel: ${hotelName} , room: ${hotelRoom}, arrivalDate: ${arrivalDate}, departureDate: ${departureDate}`);

  const providers = [
    {
      name: 'trip.com',
      getPrice: () => getPriceWithRetry(() => getTripPrice(hotelName, hotelRoom))
    },
    {
      name: 'hotels.com',
      getPrice: () => getPriceWithRetry(() => getHotelsPrice(hotelName, hotelRoom, arrivalDate, departureDate))
    }
  ]  

  const results = await Promise.all(
    providers.map(async (provider) => {
      const { price, hotelUrl } = await provider.getPrice();
      console.log(`[${provider.name}] Price: ${price}, hotelUrl: ${hotelUrl}`);
      return { provider: provider.name, price, hotelUrl };
    })
  );

  console.log(results);
  res.send(results);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function getPriceWithRetry(getPriceFunction, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const { price, hotelUrl } = await getPriceFunction();
      // console.log(`Price: ${price}, hotelUrl: ${hotelUrl}`);
      return { price, hotelUrl };
    } catch (error) {
      retries++;
      console.log(`Error occurred, retrying (${retries}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before retrying
    }
  }
  throw new Error(`Failed to get price after ${maxRetries} retries`);
}
