const axios = require('axios');
const cheerio = require('cheerio');
const ADRESSE_BRAND = "https://adresse.paris"

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-container')
    .map((i, element) => {
      const link = `${$(element)
      .find('.product-name')
      .attr('href')}`;

      return {
        link,
        'brand': 'Adresse Paris',
        'price': parseFloat($(element)
          .find('.price')
          .text()
          .replace(',00 €', '.')
          .replace(/\s/g, ' ')
        ),
        'name': $(element)
          .find('.product-name')
          .attr('title'),
        'photo': $(element)
          .find('.replace-2x')
          .attr('src')
      };
    })
    .get();
};

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

const parseLinks = data => {
  const $ = cheerio.load(data);

  return $('.cbp-links li')
    .map((i, element) => {
      const link = $(element)
        .find('a[href]')
        .attr('href');
      return link
    })
    .get();
};

module.exports.getPages = async (url = ADRESSE_BRAND) => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseLinks(data);
  }

  console.error(status);

  return null;
};
