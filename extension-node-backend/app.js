const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
const bodyParser = require('body-parser');
const { getTripPrice } = require('./tripScraper');

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
      name: 'trip',
      getPrice: () => getTripPrice(hotelName, hotelRoom)
    }
  ]

  const results = await Promise.all(
    providers.map(async (provider) => {
      const { price, hotelUrl } = await provider.getPrice();
      console.log(`[${provider.name}] Price: ${price}, tripHotelUrl: ${hotelUrl}`);
      return { provider: provider.name, price, hotelUrl };
    })
  );

  res.send(results);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})