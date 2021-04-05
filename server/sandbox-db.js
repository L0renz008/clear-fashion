/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrand = require('./sources/mudjeans');
const adressebrand = require('./sources/adresseparis');
const loom = require('./sites/loom');
const db = require('./db/index');

async function sandbox (dedicated = 'https://www.dedicatedbrand.com', mudjeans = 'https://mudjeans.eu', adresse = 'https://adresse.paris') {
  try {
    let products = [];
    let pages = await dedicatedbrand.getPages(dedicated);

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await dedicatedbrand.scrape_products(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = await mudjeansbrand.getPages(mudjeans);

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await mudjeansbrand.scrape_products(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = await adressebrand.getPages(adresse);

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await adressebrand.scrape_products(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = [
      'https://www.loom.fr/collections/hauts',
      'https://www.loom.fr/collections/bas'
    ];

    console.log('\n');

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with Promise.all`);

    const promises = pages.map(page => loom.scrape(page));
    const results = await Promise.all(promises);

    console.log(`👕 ${results.length} results of promises found`);
    console.log(`👕 ${results.flat().length} products found`);

    console.log(results);
    console.log(results.flat());

    products.push(results.flat());
    products = products.flat();

    console.log('\n');

    console.log(`👕 ${products.length} total of products found`);

    console.log('\n');

    products = new Set(products);
    products = [...products];

    const result = await db.insert(products);

    console.log(`💽  ${result.insertedCount} inserted products`);

    console.log('\n');

    console.log('💽  Find Loom products only');

    const loomOnly = await db.find({'brand': 'loom'});

    console.log(`👕 ${loomOnly.length} total of products found for Loom`);
    console.log(loomOnly);

    db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();
