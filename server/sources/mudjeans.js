const axios = require('axios');
const cheerio = require('cheerio');
const MUD_JEANS = "https://mudjeans.eu"

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-link')
    .map((i, element) => {
      const link = `https://mudjeans.eu${$(element)
      .find('.product-title a')
      .attr('href')}`;

      return {
        link,
        'brand': 'Mudjeans',
        'price': parseFloat($(element)
          .find('.product-price:first-child')
          .text()
          .replace(/\s|(Buy)|€/g, '')
          .replace(/,/g, '.')
        ),
        'name': $(element)
          .find('.product-title')
          .text()
          .trim()
          .replace(/\s/g, ' '),
        'photo': $(element)
          .find('.img.img--wrapper')
          .find('img')
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

  return $('.header-navigation--primary .header-nav-list-item')
    .map((i, element) => {
      const link = $(element)
        .find('a').attr('href');
      return `${MUD_JEANS}${link}`
    })
    .get();
};

module.exports.getPages = async (url = MUD_JEANS) => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseLinks(data);
  }

  console.error(status);

  return null;
};
