/* eslint-disable no-console, no-process-exit */
const brands = require('./brands.json');
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/mudjeansbrand');
const adresse = require('./sources/adressebrand');

async function sandbox (eshop = brands[1].url) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await mudjeans.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);