const express = require("express");
const app = express();
const {MongoClient} = require("mongodb");
const cors = require("cors");
const { parse } = require("dotenv");
const dotEnv = require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svqjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("traveller");
        const productsCollection = database.collection("services");

        // GET API
        app.get("/services", async (req,res) => {
            const cursor = productsCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        }) 
    }finally{

    }
}
run().catch(console.dir);
// Base setup
app.get("/", (req, res) => {
    res.send("Travelling Server running...");
});

app.listen(port, () => {
    console.log("Listening to server port:", port);
});