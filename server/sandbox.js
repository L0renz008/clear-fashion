/* eslint-disable no-console, no-process-exit */
//const brands = require('./brands.json');
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrand = require('./sources/mudjeans');
const adressebrand = require('./sources/adresseparis');
const fs = require('fs');
let allProducts = [];

async function dedicated (eshop = 'https://www.dedicatedbrand.com') {
  try {
    const pages = await dedicatedbrand.getPages(eshop);

    console.log(`🛍️ ${pages.length} found`);
    console.log(pages);
    
    let nombreProduits = 0;

    for (var i = 0; i < pages.length; i++) {
      console.log(`🕵️‍♀️  browsing ${pages[i]} source`);
      const products = await dedicatedbrand.scrape_products(pages[i]);

      console.log(`${products.length} items found`);
      nombreProduits += products.length;
      allProducts.push(products);
    }
    
    let data = JSON.stringify(allProducts);
    fs.writeFileSync('dedicated.json', data);
    console.log('All done!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function mudjeans (eshop = 'https://mudjeans.eu') {
  try {
    const pages = await mudjeansbrand.getPages(eshop);

    console.log(`🛍️ ${pages.length} found`);
    console.log(pages);
    
    let nombreProduits = 0;

    for (var i = 0; i < pages.length; i++) {
      console.log(`🕵️‍♀️  browsing ${pages[i]} source`);
      const products = await mudjeansbrand.scrape_products(pages[i]);

      console.log(`${products.length} items found`);
      nombreProduits += products.length;
      allProducts.push(products);
    }
    
    let data = JSON.stringify(allProducts);
    fs.writeFileSync('mudjeans.json', data);
    console.log('All done!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function adresse (eshop = 'https://adresse.paris') {
  try {
    const pages = await adressebrand.getPages(eshop);

    console.log(`🛍️ ${pages.length} found`);
    console.log(pages);
    
    let nombreProduits = 0;

    for (var i = 0; i < pages.length; i++) {
      console.log(`🕵️‍♀️  browsing ${pages[i]} source`);
      const products = await adressebrand.scrape_products(pages[i]);

      console.log(`${products.length} items found`);
      nombreProduits += products.length;
      allProducts.push(products);
    }
    
    let data = JSON.stringify(allProducts);
    fs.writeFileSync('adresse.json', data);
    console.log('All done!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

mudjeans();
