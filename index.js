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


        // users related api 

        app.get('/all-users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/all-users', async (req, res) => {
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

        app.get('/admins', async (req, res) => {
            const filter = { role: "admin" }
            const cursor = userCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const filter = { role: "user" }
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

        app.post('/classes', async (req, res) => {
            const newClasses = req.body;
            if(newClasses == {}){
                return;
            }
            const result = await classesCollection.insertOne(newClasses);
            res.send(result)
        })

        app.patch("/classes", async (req, res) => {
            const db_user = req.body;
            const id = db_user.id;
            const status = db_user.status;
            const filter = { _id: new ObjectId(id) };
            const updatedStatus = {
                $set: {
                    status: status
                }
            }
            const result = await classesCollection.updateOne(filter, updatedStatus);
            res.send(result);
        })

        //update related api
        
        app.patch("/all-users/update-role", async (req, res) => {
            const db_user = req.body;
            const id = db_user.id;
            const role = db_user.role;
            const filter = { _id: new ObjectId(id) };
            const updatedStatus = {
                $set: {
                    role: role
                }
            }
            const result = await userCollection.updateOne(filter, updatedStatus);
            res.send(result);
        })


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