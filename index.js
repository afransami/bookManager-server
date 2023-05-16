const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use (cors())
app.use (express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://user1:oZKUFNVVLmVmMQY5@cluster0.tcuzcs8.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const bookCollection = client.db("bookManager").collection("books")

    // test api
    app.get('/health', (req, res)=>{
        res.send("all is well")
    })


    // insert (post) single/a book/data to db
    app.post ('/upload-book', async (req, res)=>{
        const data = req.body;
        console.log(data);
        const result = await bookCollection.insertOne(data)
        res.send(result)
    })

// get (read) all books/data
    app.get ('/all-books', async (req, res)=>{
        const books = bookCollection.find()
        const result = await books.toArray()
        res.send(result)
    })

    // to see details button
    app.get('/book/:id', async (req, res)=>{        
      const id = req.params.id;      
      const filter = {_id: new ObjectId(id)}      
      const data = await bookCollection.findOne(filter)
      res.send (data)
  })


    // to update a single portion wil have to use patch otherwise will have to use put method
    app.patch('/book/:id', async (req, res)=>{        
        const id = req.params.id;
        const updatedBookData = req.body        
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
            $set:{
                ...updatedBookData
            }
        }
        const result = await bookCollection.updateOne(filter, updatedDoc)
        res.send (result)
    })

//  Delete item by using id
    app.delete('/book/:id', async (req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const result = await bookCollection.deleteOne(filter)
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

app.listen(port, ()=>{
    console.log(`Book Manager is running on port: ${port}`)
})