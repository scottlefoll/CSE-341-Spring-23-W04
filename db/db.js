const { MongoClient } = require('mongodb');
// const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const coll = process.env.DB_COLLECTION;
const poolSize = parseInt(process.env.DB_POOL_SIZE) || 10;

let pool;

async function connect() {
  console.log('connect() function called');
  console.log("uri:", uri)
  if (!pool) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: poolSize,
        maxPoolSize: poolSize,
        wtimeout: 2500,
    });
    try {
        await client.connect();
        console.log('Connected successfully to database');
        pool = client.db(dbName).collection(coll);
        return pool;
    } catch (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
  } else {
    console.log('Connection pool already exists');
    return pool;
  }
}

async function close() {
    if (client){
        try {
            await client.close();
            console.log('Connection to database closed');
            pool = undefined;
        } catch (err) {
            console.error('Error closing database connection:', err);
            throw err;
        }
    }
}



module.exports = { connect, close};

//  mongoose connect
// async function monConnect(uri) {
//     try {
//       await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//       console.log('Connected successfully to database using mongoose');
//       const db = mongoose.connection;
//       return db;
//     } catch (err) {
//       console.error('Error connecting to database:', err);
//       throw err;
//     }
//   }

// mongoose close
// async function monClose() {
//     try {
//       await mongoose.connection.close();
//       console.log('Connection to database closed');
//     } catch (err) {
//       console.error('Error closing database connection:', err);
//       throw err;
//     }
//   }

//  mongoose version
// module.exports = { monConnect, monClose };