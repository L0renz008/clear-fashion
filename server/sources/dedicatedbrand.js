const axios = require('axios');
const cheerio = require('cheerio');
const DEDICATED_BRAND = "https://www.dedicatedbrand.com";

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const link = `https://www.dedicatedbrand.com${$(element)
        .find('.productList-link')
        .attr('href')}`;
      
        return {
          link,
          'brand': 'dedicated',
          'price': parseFloat(
            $(element)
              .find('.productList-price')
              .text()
          ),
          'name': $(element)
            .find('.productList-title')
            .text()
            .trim()
            .replace(/\s/g, ' '),
          'photo': $(element)
            .find('.productList-image img')
            .attr('src')
        };
    })
    .get();
};


function parseHomepage (data){
  const $ = cheerio.load(data);
  return $('.mainNavigation-link-subMenu-link')
    .map((i, element) => {
      const href = $(element).find('a').attr('href');
      return `${DEDICATED_BRAND}${href}`
    })
    .get();
}

module.exports.getPages = async (url = DEDICATED_BRAND) => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseHomepage(data);
  }

  console.error(status);

  return [];
}

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape_products = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

//Scrapeall links on the welcome page of the website
module.exports.scrape_links = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse_links(data);
  }

  console.error(status);

  return null;
};

const parse_links = data => {
  const $ = cheerio.load(data);

  return $('.mainNavigation-fixedContainer .mainNavigation-link-subMenu-link')
    .map((u, element) => {
      const link = $(element)
        .find('.mainNavigation-link-subMenu-link > a[href]')
        .attr('href')
      
        return link;
    })
    .get();
};
