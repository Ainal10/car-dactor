
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;


//  middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jvnen5b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const servicesCollection = client.db('carDactor').collection('services');
const checkoutCollection = client.db('carDactor').collection('checkout');


app.patch('/checkout/:id'), async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedChecking = req.body;
  console.log(updatedChecking);
  const updateDoc = {
    $set: {
      status: updatedChecking.status
    },
  };
  const result = await checkoutCollection.updateOne(filter, updateDoc);
  res.send(result);
}


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

  
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }


      const options = {

        // Include only the `title` and `imdb` fields in each returned document
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };

      const result = await servicesCollection.findOne(query, options);
      res.send(result);
    })

    // checkout

    app.get('/checkout', async (req, res) => {

      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      console.log(query)
      const result = await checkoutCollection.find(query).toArray();
      res.send(result);
    })
    app.post('/checkout', async (req, res) => {
      const checkout = req.body;
      console.log(checkout);
      const result = await checkoutCollection.insertOne(checkout);
      res.send(result)
    });
    // update


    // delete 

    app.delete('/checking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await checkoutCollection.deleteOne(query);
      res.send(result)

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
  res.send('Car doctor came ia')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})