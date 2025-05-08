const express = require("express");
const cors = require("cors");
const db = require("./services/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/footballData", async (req, res) => {
    try{
      const footballData = await db("footballData");
      res.status(200).json(footballData)
    } catch{
        res.status(500).json({message:"Internal server error"})
    }
})

app.listen(3333, () => {
    console.log("Server is running on port 3333");
})