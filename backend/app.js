const express = require("express");
const cors = require("cors");
const db = require("./services/db");

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3333, () => {
    console.log("Server is running on port 3333");
})