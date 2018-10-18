const express = require('express');
const app = express();

const songRouter = require("./routes/songs");
const movieRouter = require("./routes/movies");

app.use(express.json())

app.use('/songs', songRouter);
app.use('/movies', movieRouter);

module.exports = app