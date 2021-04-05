//require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = 'mongodb+srv://L0renz008:MtBC7Twx3m3CBrsd@clearfashioncluster.djred.mongodb.net/clearfashion?retryWrites=true&w=majority';

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database =  client.db(MONGODB_DB_NAME)

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async (query, limit, sorting, page) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const number_doc = await collection.find(query).sort({price:sorting}).count()
    const result = await collection.find(query).sort({price:sorting, _id:1}).limit(limit).skip((page - 1) * limit).toArray();

    return [result, number_doc];
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.length = async() => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    let length = await collection.countDocuments()
    return length;
  } catch(e) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.brands = async brand => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({'brand':brand})
    return result;
  } catch(e) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.lower_than_price = async price => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({'price':{$lte:price}})
    return result;
  } catch(e) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.sorted_price = async() => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.sort({'price':1})
    return result;
  } catch(e) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};
