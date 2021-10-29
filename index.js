const express = require('express');
const app = express();
const {MongoClient} = require("mongodb"); 
const env = require('dotenv').config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DATABASE 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svqjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect(); 
        const database = client.db("traveller");
        const servicesCollention = database.collection("services");
        
        // GET API
        app.get("/services", async (req,res) => {
            const cursor = servicesCollention.find({});
            const services =await cursor.toArray();
            res.send(services);
        })
        app.get("/services/:id", async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await servicesCollention.findOne(query);
            res.send(service);
        })

    }finally{

    }

    // Order
    try{
        await client.connect(); 
        const database = client.db("traveller");
        const servicesCollention = database.collection("proceedOrder");
        
        // POST API
        app.post("/orderPlace/:id", async (req,res) => {
            const user = req.body;
            const result = await servicesCollention.insertOne("hiiting",user);
           res.send(result);
       });

        app.post("/myOrders", async (req,res) => {
            const userEmail = req.body.userEmail;
            const cursor =servicesCollention.find({});
            const result = await cursor.toArray();
            const newResult = result.filter(newResult => newResult.email === userEmail);
            res.send(newResult);
        });

        //    DELETE API
        app.delete("/myOrders/:id", async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollention.deleteOne(query);
            res.send(result);
        })
    }finally{

    }
}
run().catch(console.dir());


// Basic
app.get("/", (req,res) => {
    res.send("Traveller BD Server Running...");
});

app.listen(port, () => {
    console.log("Server Running on port:", port);
});