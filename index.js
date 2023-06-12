const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfido6v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const userCollection = client.db("photoCraft").collection("users");

        const classesCollection = client.db("photoCraft").collection("classes");

        // const toyCollection = client.db("toyVerse").collection("")

        // users related api 

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query)
            console.log('existing user', existingUser);
            if (existingUser) {
                return res.send({ message: 'user already exists' })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // instructors related api

        app.get('/instructors', async (req, res) => {
            const filter = { role: "instructor" }
            const cursor = userCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result);
        })

        // classes related api

        app.get('/classes', async (req, res) => {
            const cursor = classesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // app.get('/toy', async (req, res) => {
        //     const cursor = toyCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        // app.post('/toy', async (req, res) => {
        //     const newToy = req.body;
        //     console.log(newToy);
        //     const result = await toyCollection.insertOne(newToy);
        //     res.send(result)
        // })

        // app.get("/toy/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await toyCollection.findOne(query);
        //     res.send(result);
        // })

        // app.delete("/toy/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const result = await toyCollection.deleteOne(query);
        //     res.send(result);
        // })

        // app.patch("/toy/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedToy = req.body;
        //     const latestToy = {
        //         $set: {
        //             toy_name: updatedToy.toy_name,
        //             photo: updatedToy.photo,
        //             category: updatedToy.category,
        //             seller_name: updatedToy.seller_name,
        //             seller_email: updatedToy.email,
        //             price: updatedToy.price,
        //             rating: updatedToy.rating,
        //             quantity: updatedToy.quantity,
        //             description: updatedToy.details,
        //         }
        //     }
        //     const result = await toyCollection.updateOne(query, latestToy, options);
        //     res.send(result);
        // })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('PhotoCraft Server is running')
})

app.listen(port, () => {
    console.log(`PhotoCraft Server is running on port ${port}`);
})