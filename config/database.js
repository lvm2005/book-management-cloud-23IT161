const { MongoClient } = require("mongodb");

const readClient = new MongoClient(process.env.MONGO_READ_URI);
const writeClient = new MongoClient(process.env.MONGO_WRITE_URI);

let readDb;
let writeDb;

async function connectDatabases() {
    await readClient.connect();
    await writeClient.connect();

    readDb = readClient.db();
    writeDb = writeClient.db();

    console.log("READ database connected");
    console.log("WRITE database connected");
}

function getReadDb() {
    return readDb;
}

function getWriteDb() {
    return writeDb;
}

module.exports = {
    connectDatabases,
    getReadDb,
    getWriteDb
};