const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());



console.log(process.env.DB_PASS);

// mongodb_Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6exc3xw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const allFoodCollection =client.db('TheCaptainBoil').collection('AllFoods')
    const topFoodCollection =client.db('TopFoods').collection('TopFood')
 app.get('/foods', async (req, res) => {
      const cursor = allFoodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
 });
 
     app.post('/tops', async (req, res) => {
      const addAll = req.body;
      console.log(addAll);
       const result = await topFoodCollection.insertOne(addAll);
       res.send(result);
    });
    app.get('/myfood/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await topFoodCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
     app.delete('/myfood/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await topFoodCollection.deleteOne(query);
      res.send(result);
    });
     app.get('/tops', async (req, res) => {
      const cursor = topFoodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
     });
    // update
     app.get('/tops/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await topFoodCollection.findOne(query);
      res.send(result);
     });
    app.put('/tops/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedFood = req.body;
      const food = {
        $set: {
          name:updatedFood.name,
      image:updatedFood.image,
      category:updatedFood.category,
      price:updatedFood.price,
      origin:updatedFood.origin,
      description:updatedFood.description,
        },
      };
      const result = await topFoodCollection.updateOne(filter, food, options);
      res.send(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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
  res.send('The captain BOil is running')
});

app.listen(port, () => {
  console.log(`The Captain Boil is running on port ${port}`)
})