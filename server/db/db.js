const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb://localhost:27017"; // Connect to local MongoDB

// Database and collection names
const dbName = "calorie_db";
const collectionName = "users";

const client = new MongoClient(uri);
client.connect();

const fetchUsers = async () => {
    try {
        // Connect to the MongoDB server
        
        // Select database and collection
        const database = client.db(dbName);
        const usersCollection = database.collection(collectionName);

        // Fetch all users
        const users = await usersCollection.find({}).toArray();

        // Print users
        console.log("Users Data:", users);
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        await client.close(); // Close connection
    }
}


module.exports = { fetchUsers }