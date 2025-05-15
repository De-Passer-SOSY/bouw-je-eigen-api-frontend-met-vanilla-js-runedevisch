const express = require("express");
const cors = require("cors");
const db = require("./services/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/footballData", async (req, res) => {
    try{
        const footballData = await db("footballData");
        res.status(200).json(footballData);
    } catch{
        res.status(500).json({message:"Internal server error"});
    }
});

app.get("/match/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const match = await db("footballData").where({ id }).first();
    if(match) res.json(match);
    else res.status(404).json({message: "Match not found"});
});

app.post("/newMatch", async (req, res) => {
    const { match_date, competition_name, season, home_team_name, away_team_name, home_score, away_score, stadium } = req.body;
    const [id] = await db("footballData").insert({
        match_date,
        competition_name,
        season,
        home_team_name,
        away_team_name,
        home_score,
        away_score,
        stadium
    });
    res.status(201).json({id});
});

app.put("/updateMatch/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { match_date, competition_name, season, home_team_name, away_team_name, home_score, away_score, stadium } = req.body;
    await db("footballData").where({ id }).update({
        match_date,
        competition_name,
        season,
        home_team_name,
        away_team_name,
        home_score,
        away_score,
        stadium
    });
    res.json({ message: "Bijgewerkt" });
});

app.delete("/deleteMatch/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await db("footballData").where({ id }).del();
    if(deleted) res.json({ message: "Verwijderd" });
    else res.status(404).json({ message: "Match niet gevonden" });
})

app.listen(3333, () => {
    console.log("Server is running on port 3333");
})