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

  app.get('/get-hotel-price/:hotelName', async (req, res) => {
    const { hotelName } = req.params;
    console.log(`Getting price for hotel: ${hotelName}`);
    const price = await getPrice(hotelName);
    res.send({ price });
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})