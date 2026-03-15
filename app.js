const express = require("express");
const app = express();

const config = require("./config.json");

//== connect to database
const mongoURI =
  config.MONGODB_URI || "mongodb://localhost:27017" + "/newsFeed";

let mongoose = require("mongoose");
const Leaderboard = require("./model");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

const onePageArticleCount = 20;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

// your code here!
app.get("/topRankings", async (req, res) => {
  try {
    // get limit and offset from query
    let limit = parseInt(req.query.limit) || onePageArticleCount;
    let offset = parseInt(req.query.offset) || 0;

    const leaderboard = await Leaderboard.find()
      .sort({ global_rank: 1 }) // sort by rank
      .skip(offset) // skip records
      .limit(limit); // return limited records

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==end==

module.exports = { app, db };
