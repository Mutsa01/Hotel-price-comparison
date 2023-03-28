const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
const bodyParser = require('body-parser');
const { getPrice } = require('./tripScraper');

// Enable CORS and bodyParser middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/newEndpoint', (req, res) => {
    res.send('This is my new endpoint!')
  })

  app.get('/get-hotel-price/:hotelName/:hotelRoom', async (req, res) => {
    const hotelName = req.params.hotelName;
    const hotelRoom = req.params.hotelRoom;
    console.log(`Getting price for hotel: ${hotelName} , room: ${hotelRoom}`);
    const {price, tripHotelUrl} = await getPrice(hotelName, hotelRoom);
    console.log(`Price: ${price}, tripHotelUrl: ${tripHotelUrl}`);
    res.send({ price, tripHotelUrl });
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})