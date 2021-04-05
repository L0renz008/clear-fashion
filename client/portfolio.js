// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};


// initiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const selectSort = document.querySelector('#sort-select');
const selectReasonnable = document.querySelector('#reasonnable');
const selectFavorite = document.querySelector('#displayFavorite');

const spanNbProducts = document.querySelector('#nbProducts');
const quartile90 = document.querySelector('#p90');
const quartile95 = document.querySelector('#p95');
const quartile50 = document.querySelector('#p50');


let filter_reasonable = "off";
let filter_favorite = "off";
let favorites = [];
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
 //https://server.vercel.app
 //https://clear-fashion-api.vercel.app
const fetchProducts = async (page = 1, size = 12,brand="All") => {
  try {
    if (brand == "All"){
      const response = await fetch(
      `https://server-tau-five.vercel.app/products?page=${page}&size=${size}`
      );
      const body = await response.json();

      if (body.success !== true) {
        console.error(body);
        return {currentProducts, currentPagination};
      }

      return body.data;
    }
    else{
      const response = await fetch(
      `https://server-tau-five.vercel.app/products?page=${page}&size=${size}&brand=${brand}`
      );
      const body = await response.json();

      if (body.success !== true) {
        console.error(body);
        return {currentProducts, currentPagination};
      }
      return body.data;    
    }
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
      <div class="product-card" id=${product._id}>
            <div class="product-image">
              <a href="${product.link} target="_blank">
                <img src="${product.photo}">
              </a>
            </div>
            <div class="product-info">
              <span><b>${product.brand}</b></span>
              <a class="prodname" href="${product.link}" target="_blank">${product.name}</a>
              <p>${product.price}€</p>
            </div>
          
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2 align=CENTER>Products </h2>';
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
 * Render page Indicators
 */

function percentile(products,n){
    var sorted = [...products].sort((a, b) => SortByPrice(a, b));
    var pos = Math.round(((sorted.length) - 1) * n);
    return sorted[pos].price;
  
}
const renderIndicators = (pagination,products) => {
  const {count} = pagination;

  spanNbProducts.innerHTML = products.length;
  quartile90.innerHTML = percentile(products,0.9)+ " euros"
  quartile95.innerHTML = percentile(products,0.95)+ " euros"
  quartile50.innerHTML = percentile(products,0.5) + " euros"
};

/**
  * Get list of brands from list of products
  */

function getBrandsFromProducts(products){
  //const brands = [...new Set(products.map(product => product.brand))];
  const brands = ["All","loom","adresse","dedicated","mudjeans"];
  return brands;
}

/** 
  * Render brands selector
  * brands
**/

const renderBrands = brands => {
  const options = Array.from(
    {'length': brands.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`
  ).join('');

  selectBrand.innerHTML = options;
  //selectPage.selectedIndex = currentPage - 1;
};



const render = (products, pagination) => {
  products = filter_products(products)
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination,products);

  /*const brands = getBrandsFromProducts(products);
  renderBrands(brands);*/

};


/*const sortbrand = (products, brand) => {
  const sort_product = [];
  for (var i =0; i< products.length; i++)
  {
    if (products[i]["brand"]==brand){
      sort_product.push(products[i]);
    }
  }
  renderProducts(sort_product);
}
*/
function SortByPrice(a,b){
    let comparison = 0;
    if (a["price"] > b["price"]) {
      comparison = 1;
    } else if (a["price"] < b["price"]) {
      comparison = -1;
    }
    return comparison;
}

function SortByDate(a,b){
    let comparison = 0;
    if (a.date > b.date) {
      comparison = 1;
    } else if (a.date < b.date) {
      comparison = -1;
    }
    return comparison;
}


/**
Reasonnable
**/
/*function FilterRasonnable(products){
  const productsUnder50 = products.filter(x => x.price<=50)
  render(productsUnder50,currentPagination)
}*/

function filter_products(products){
  if(filter_reasonable === 'on') {
    products = products.filter(x => x.price<=50)
  }
  if(filter_favorite === 'on') {
    products = favorites;
  }
  
  return products;
}


function addToFavorite(product){
  if (favorites.includes(product)==false)
  {
    favorites.push(product)
  }
  else{
    for (var i=0;i<favorites.length;i++){
      if(favorites[i]==product)
      {
        favorites.splice(i,1)
      }
    }
  }
}
/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value),selectBrand.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});


/**
 * Select the page to display
 * @type {[type]}
 */

selectPage.addEventListener('change', event => {
  //console.log(parseInt(event.target.value));
  fetchProducts(parseInt(event.target.value),selectShow.value,selectBrand.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
    //console.log(currentPagination);
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);

selectReasonnable.addEventListener("change",event=> {  
  if(filter_reasonable == "on"){    
    filter_reasonable = 'off';
  }
  else{
    filter_reasonable = "on";
  }  
  render(currentProducts, currentPagination);
});

selectFavorite.addEventListener("change",event=> {  
  if(filter_favorite == "on"){    
    filter_favorite = 'off';
  }
  else{
    filter_favorite = "on";
  }  
  render(currentProducts, currentPagination);
});

sectionProducts.addEventListener("change",event=> {
  for (var i =0;i<currentProducts.length;i++)
  {
    if (currentProducts[i].name == event.target.id)
    {
      addToFavorite(currentProducts[i])
    }
  }
});


selectBrand.addEventListener("change",event=> {
  
  fetchProducts(currentPagination.currentPage,selectShow.value,event.target.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))

  //sortbrand(fetchProducts(currentProducts), event.target.value)
});

selectSort.addEventListener('change', event =>{

  // Price ascending
  if(event.target.value === 'price-asc'){
    currentProducts = [...currentProducts].sort((a, b) => SortByPrice(a, b));

  }
  //Price descending
  if(event.target.value === 'price-desc'){
    currentProducts = [...currentProducts].sort((a, b) => SortByPrice(a, b));
    currentProducts.reverse();

  }
  //Date ascending
  if(event.target.value === 'date-asc'){
    currentProducts = [...currentProducts].sort((a, b) => SortByDate(a, b));

  }
  //Date descending
  if(event.target.value === 'date-desc'){
    currentProducts = [...currentProducts].sort((a, b) => SortByDate(a, b));
    currentProducts.reverse();
  }
  render(currentProducts, currentPagination);
})