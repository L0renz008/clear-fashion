/* eslint-disable no-console, no-process-exit */
const brands = require('./brands.json');
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/mudjeansbrand');
const adresse = require('./sources/adressebrand');

async function sandbox (eshop = brands[0].url) {
  try {
    const pages = await dedicatedbrand.getPages(eshop);
    console.log(`🛍️ ${pages.length} found`);
    console.log(pages);
    if(!eshop) {
      eshop = pages[Math.floor(Math.random() * pages.length)];
    }



    console.log(`🕵️‍♀️  browsing ${pages[3]} source`);

    const products = await dedicatedbrand.scrape(pages[3]);
    
    console.log(`${products.length} items found`);
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