// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentSort = '';
const currentFilters = {
  'recently' : 'off',
  'reasonable' : 'off'
}

// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const checkRecently = document.querySelector('#recently-released');
const checkReasonable = document.querySelector('#reasonable-price');
const selectSort = document.querySelector('#sort-select');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Get list of brand from lists of products
 * @param {Array} products
 */
function getBrandsFromProducts (products) {
  const brands = ['']
  for (const product of products){
    if (!(brands.includes(product.brand))) {
      brands.push(product.brand);
    }
  }
  return brands;
}

/**
 * Render brand selector
 * @param  {Array} brands
 */
const renderBrands = brands => {
  const options = Array.from(
    brands,
    value => `<option value="${value}">${value}</option>`
  ).join('');

  selectBrand.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

/**
 * Render list of product sorted by brand
 * @param {Array} products
 * @param {Array} brand
 */
const renderProductByBrand = (products, brand) => {
  const sort_product = [];
  for (var i = 0; i < products.length; i++)
  {
    if(products[i]["brand"] == brand){
      sort_product.push(products[i]);
    }
    
  }
  if(brand == ""){
    renderProducts(products);
  }
  else{
    renderProducts(sort_product);
  }
  
}

/**
 * Render list of products by filters
 * @param  {Array} products
 */
const filterProducts = products => {
  if (currentFilters['recently'] === 'on') {
    products = products.filter(product =>
      (Date.now() - Date.parse(product.released)) / 1000 / 3600 / 24 < 60);
  }
  if (currentFilters['reasonable'] === 'on') {
    products = products.filter(product => product.price < 100);
  }
  renderProductByBrand(products);

  return products;
};


const sortProduct = (products) => {
  if (currentSort == "price-asc"){
    products.sort((a, b) => a.price - b.price);
  }
  else if (currentSort == "price-desc"){
    products.sort((a, b) => b.price - a.price);
  }
  else if (currentSort == "date-asc"){
    products.sort((a, b) => a.released < b.released)
  }
  else if (currentSort == "date-desc"){
    products.sort((a, b) => b.released < a.released)
  }
}




const render = (products, pagination) => {
  products = filterProducts(products);
  sortProduct(products);
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);

  const brands = getBrandsFromProducts(products);
  renderBrands(brands);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

/**
 * Select the page to display
 */
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

/**
 * Select the brand to display
 */
selectBrand.addEventListener('change', event => {
  renderProductByBrand(currentProducts, event.target.value)
});

checkRecently.addEventListener('change', () => {
  currentFilters['recently'] =
    currentFilters['recently'] === 'on' ? 'off' : 'on';
  render(currentProducts, currentPagination);
});

checkReasonable.addEventListener('change', () => {
  currentFilters['reasonable'] =
    currentFilters['reasonable'] === 'on' ? 'off' : 'on';
  render(currentProducts, currentPagination);
});

selectSort.addEventListener('change', event => {
  currentSort = event.target.value;
  render(currentProducts, currentPagination);
});



document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);

