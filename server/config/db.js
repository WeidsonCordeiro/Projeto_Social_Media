const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbHost = process.env.MONGODB_HOST;
const bd = process.env.MONGODB_BD;
//const URI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${bd}?retryWrites=true&w=majority&appName=Cluster0`;

const MONGODB_URI = `mongodb://${dbUser}:${encodeURIComponent(dbPassword)}@ac-hxiddxe-shard-00-00.iexdbkf.mongodb.net:27017,ac-hxiddxe-shard-00-01.iexdbkf.mongodb.net:27017,ac-hxiddxe-shard-00-02.iexdbkf.mongodb.net:27017/${bd}?ssl=true&replicaSet=atlas-gyipl8-shard-0&authSource=admin&appName=Cluster0`;

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    console.log("MongoDB conectado");
  } catch (error) {
    global.mongoose.promise = null;
    console.error("Erro ao conectar:", error);
    throw error;
  }

  return global.mongoose.conn;
};

module.exports = connectDB;
