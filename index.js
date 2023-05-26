const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez2u9zk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const allToysCollection = client.db("allActionToys").collection("toysInfo");

    // search my toy name

    app.get("/getToyNameByText/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await allToysCollection
        .find({
          $or: [
            {
              name: { $regex: searchText, $options: "i" },
            },
          ],
        })
        .toArray();

      res.send(result);
    });

    // show by category
    app.get("/subCategory1", async (req, res) => {
      const query = { subCategory: "Action Figures" };
      const cursor = allToysCollection.find(query);
      const categoryToys = await cursor.toArray();
      res.send(categoryToys);
    });
    app.get("/subCategory2", async (req, res) => {
      const query = { subCategory: "super Hero" };
      const cursor = allToysCollection.find(query);
      const categoryToys = await cursor.toArray();
      res.send(categoryToys);
    });
    app.get("/subCategory3", async (req, res) => {
      const query = { subCategory: "Playsets" };
      const cursor = allToysCollection.find(query);
      const categoryToys = await cursor.toArray();
      res.send(categoryToys);
    });

    // show all toys
    app.get("/allToys", async (req, res) => {
      const cursor = allToysCollection.find().limit(20);
      const toys = await cursor.toArray();
      res.send(toys);
    });
    app.get("/allToy", async (req, res) => {
      const cursor = allToysCollection.find();
      const toys = await cursor.toArray();
      res.send(toys);
    });

    // post a data fro add a toy
    app.post("/allToys", async (req, res) => {
      const toy = req.body;
      const addToy = await allToysCollection.insertOne(toy);
      res.send(addToy);
    });

    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(query);
      res.send(result);
    });

    app.get("/myToys", async (req, res) => {
      console.log(req.query.sort);
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = allToysCollection.find(query);
      const myToys = await cursor.toArray();
      res.send(myToys);
    });

    // sorting data
    app.get("/shortData", async (req, res) => {
      const cursor = allToysCollection.find().sort({ price: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/shortLong", async (req, res) => {
      const cursor = allToysCollection.find().sort({ price: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // updated data
    app.patch("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updatedToy = req.body;
      const updateDoc = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          massage: updatedToy.massage,
        },
      };
      const result = await allToysCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete data
    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment 11 server side is Running");
});

app.listen(port, () => {
  console.log(`Toy Server Side is Running on port: ${port}`);
});
