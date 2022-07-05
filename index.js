const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ycyqo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

async function run() {
  try {
    await client.connect();
    const itemCollection = client.db('dbMango').collection('item');
    console.log('okay');

    app.get('/inventory', async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.get('/inventory/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)};
        const item = await itemCollection.findOne(query);
        res.send(item);
    });

    app.post('/inventory', async (req, res) => {
      const newItem = req.body;
      const item = await itemCollection.insertOne(newItem);
      res.send(item);
    });
    app.put('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const updateItems = req.body;
      const filter = {_id: ObjectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          brand: updateItems.brand,
          phone_name: updateItems.phone_name,
          price: updateItems.price,
          image: updateItems.image,
          RAM: updateItems.RAM,
          internal_storage: updateItems.internal_storage,
          display: updateItems.display,
          color: updateItems.color,
        },
      };
      const result = await itemCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });



    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
7;
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('For Mango Jelly');
});

app.listen(port, () => {
  console.log('Listing to port :', port);
});
