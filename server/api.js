const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db/index');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', async(request, response) => {
  let brand = request.query.brand || null;
  let price = parseInt(request.query.price) || null;
  let limit = parseInt(request.query.limit) || 12;

  const result = await db.findByBrand(brand, price, limit, page);
  response.send({
    'limit':limit,
    'total':result.length,
    'result': result});
});

app.get('/products/:id', async(request, response) => {
  response.send(await db.findById(request.params.id));
});

app.get('/products', async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 12;
  let brand = req.query.brand || null;
  let price = parseInt(req.query.price) || null;
  
  let result = await db.find({"price":{$lte:1000}}, limit, page)

  if(brand != null || price != null)
  {
    result = await db.findByBrand(brand, price, limit, page);
  }
  res.send({"success":true,"data":{"result":result,"meta":{"currentPage":page,"pageCount":Math.round(result.length/limit),"pageSize":limit,"count":result.length}}});
});


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
