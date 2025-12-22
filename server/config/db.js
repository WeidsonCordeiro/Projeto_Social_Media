const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

// Validar variáveis de ambiente
if (!dbUser || !dbPassword || !dbHost) {
  console.error(
    "Erro: Variáveis de ambiente DB_USER, DB_PASSWORD ou DB_HOST não definidas."
  );
  process.exit(1);
}

// URL-encode password para evitar caracteres especiais causarem erro
const encodedPassword = encodeURIComponent(dbPassword);

const URI = `mongodb+srv://${dbUser}:${encodedPassword}@${dbHost}/?retryWrites=true&w=majority`;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(URI, { dbName: "Social" });
    console.log("Conectado ao MongoDB!");
    return dbConn;
  } catch (error) {
    console.error("Erro na conexão:", error.message);
  }
};

conn();

module.exports = conn;
