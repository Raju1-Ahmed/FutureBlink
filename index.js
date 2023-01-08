const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlhmfbm.mongodb.net/?retryWrites=true&w=majority`;
console.log("uri is connect:", uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    //Data Base File Collection
    const postsCollection = client.db('Post-Collection').collection('post');

    //user collect api for Get
    app.get('/posts', async (req, res) => {
      const post = await postsCollection.find().toArray();
      res.send(post);
    });

    //user collect api for post
    // app.post('/addUser', async (req, res) => {
    //   const review = req.body;
    //   const result = await usersCollection.insertOne(review);
    //   res.send(result);
    // })
      // delete user collection api 

    // app.delete('/order/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await usersCollection.deleteOne(query);
    //   res.send(result);
    // })

    

  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From FutureBlink!')
})

app.listen(port, () => {
  console.log(`Example FutureBlink listening on port ${port}`)
})