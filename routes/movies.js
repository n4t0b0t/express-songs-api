const express = require('express');
const router = express.Router()

let movies = [];

// Movies API
//return list of all movies
router.get('/', (req, res) => {
    res.status(200).json(movies);
});
  
//create a new movie, and return new movie
router.post('/', (req, res) => {
    let newmovie = {
        id: movies.length + 1,
        name: req.body.name,
        artist: req.body.artist 
    }
    movies.push(newmovie);
    res.status(201).json(newmovie);
});
  
//return a movie with id 
router.get('/:id', (req, res) => {
    let movie = movies.find(movie => movie.id == parseInt(req.params.id));
    res.status(200).json(movie);
});
  
//edit a movie with id, and return edited movie
router.put('/:id', (req, res) => {
    let movie = movies.find(movie => movie.id === parseInt(req.params.id));
    movie.name = req.body.name;
    movie.artist = req.body.artist;
    res.status(200).json(movie);
});
  
//delete a movie with id, and return deleted movie
router.delete("/:id", (req, res) => {
    let movieToDelete = movies.find(movie => movie.id === parseInt(req.params.id));
    let index = movies.indexOf(movieToDelete);
    movies.splice(index, 1);
    res.status(200).json(movieToDelete);
});

module.exports = router