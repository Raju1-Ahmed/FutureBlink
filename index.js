const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlhmfbm.mongodb.net/?retryWrites=true&w=majority`;
// console.log("uri is connect:", uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    //Data Base File Collection
    const postsCollection = client.db('Post-Collection').collection('post');
    const commentsCollection = client.db('Post-Collection').collection('comments');

    //post collect api for Get
    app.get('/posts', async (req, res) => {
      const post = await postsCollection.find().toArray();
      res.send(post);
    });

    app.get('/usersComment', async (req, res) => {
      const post = await commentsCollection.find().toArray();
      res.send(post);
    });

    //post collect api for Get single id
    app.get('/service/:id',  async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId (id) };
      const service = await postsCollection.findOne(query);
      res.send(service);
    })

    //post collect api for image upload
    const storage = multer.diskStorage({
      destination: (req, file, cb) =>{
        cb(null, "images");
      },
      filename: (req, file,cb) =>{
        cb(null, req.body.name);
      }
    })
    const upload = multer({storage: storage});
    app.post('/upload', upload.single("file"), (req, res) => {
     console.log(req.file);
     if(!req.file){
        res.send({ code: 500, msg: 'err' })
     } else{
      res.send({ code: 200, msg: 'upload successfully s' })
     }
    })

     //post collect api for post
     app.post('/post', async (req, res) => {
      const review = req.body;
      const result = await postsCollection.insertOne(review);
      res.send(result);
    })

     //post collect api for post
     app.post('/comment', async (req, res) => {
      const review = req.body;
      const result = await commentsCollection.insertOne(review);
      res.send(result);
    })

  

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