import express from "express";
// import { MongoClient, ObjectID } from "mongodb";
import mongodb from "mongodb";
const { MongoClient } = mongodb;
const ObjectId = mongodb.ObjectId;
import * as dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
//const PORT = 4000;

//app.use(cors());
app.use(cors({
    origin: '*'
  }));


// const MONGO_URL= "mongodb://127.0.0.1";
const MONGO_URL= process.env.MONGO_URL;
async function createConnection(){
    const client= new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected");
    return client;
}
const client= await createConnection();

app.use(express.json());

app.get("/", function (request, response){
    response.send("Hi World");
})
app.listen(PORT, ()=>console.log(`The server started in : ${PORT}`));

//Get all movies
app.get("/movies", async function (request, response){
    const movies=await client
                    .db("b38wd")
                    .collection("movies")
                    .find({})
                    .toArray();
    response.send(movies);
});

//Get movie by id
app.get("/movies/:id", async function (request,response){
    const {id}= request.params;
    console.log(request.params,id);
    const movie= await client
    .db("b38wd")
    .collection("movies")
    .findOne({_id:ObjectID(id)});
    // response.send(movie);
    movie?response.send(movie):response.status(404).send({msg:"Movie not found"});
});

//create movies
app.post("/movies",async function(request, response) {
    const data=request.body;
    console.log(data);
    const result= await client
                        .db("b38wd")
                        .collection("movies")
                        .insertOne(data);
    response.send(result);
});

//delete movie
app.delete("/movies/:id", async function (request,response){
    const {id}= request.params;
    console.log(request.params,id);
    const result= await client
    .db("b38wd")
    .collection("movies")
    .deleteOne({_id:ObjectID(id)});
    response.send(movie);
    result.deletedCount>0 ?response.send({msg:"Movie deleted succesfully"}):response.status(404).send({msg:"Movie not found"});
});

//Update movie by id
app.put("/movies/:id", async function (request,response){
    const {id}= request.params;
    const data=request.body;
    const movie= await client
    .db("b38wd")
    .collection("movies")
    .updateOne({_id:ObjectID(id)},{$set: data});
    console.log(movie);
    movie?response.send(movie):response.status(404).send({msg:"Movie not found"});
});
