const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dngm2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("restaurant");
    const foodCollection = database.collection("foods");
    const orderCollection = database.collection("orders");

    // create a document to insert
    app.post("/addmeal", async (req, res) => {
      console.log(req.body);
      const result = foodCollection.insertOne(req.body);
      // res.send(result.acknowledged);
      console.log(result);
    });

    app.get("/foods", async (req, res) => {
      const result = await foodCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateFood = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateFood.name,
          id: updateFood.id,
          description: updateFood.description,
          price: updateFood.price,
          img: updateFood.img,
        },
      };

      const result = await foodCollection.updateOne(filter, updateDoc, options);
      console.log(result);
      res.send(result);
    });

    app.post("/addorder", async (req, res) => {
      console.log(req.body);
      const order = await orderCollection.insertOne(req.body);
      console.log(order);
    });

    app.get("/addorder", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
      console.log(result);
    });

    app.delete("/deletefood/:_id", async (req, res) => {
      const id = req.params._id;
      const result = await foodCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result.acknowledged);
    });

    // console.log(`A document was inserted with the  _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
