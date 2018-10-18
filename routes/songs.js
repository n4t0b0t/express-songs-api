const express = require('express');
const router = express.Router();

let songs = [];

//Song API
router.param('id', (req, res, next, id) => {
    let song = songs.find(song => song.id === parseInt(id));
    req.song = song;
    next();
});

//return list of all songs
router.get('/', (req, res, next) => {
    res.status(200).json(songs);
});

//create a new song, and return new song
router.post('/', (req, res) => {
    if(!req.body){
        return next(new Error("Unable to create song"))
    }

    let newSong = {
        id: songs.length + 1,
        name: req.body.name,
        artist: req.body.artist 
    }
    songs.push(newSong);
    res.status(201).json(newSong);
});

//return a song with id 
router.get('/:id', (req, res, next) => {
    if(!req.song){
        return next(new Error(`Unable to find song with id: ${req.params.id}`))
    }

    res.status(200).json(req.song);
});

//update a song with id, and return edited song
router.put('/:id', (req, res, next) => {
    if(!req.song){
        return next(new Error(`Unable to update song with id: ${req.params.id}`))
    }

    req.song.name = req.body.name;
    req.song.artist = req.body.artist;
    res.status(200).json(req.song);
});

//delete a song with id, and return deleted song
router.delete("/:id", (req, res, next) => {
    if(!req.song){
        return next(new Error(`Unable to delete song with id: ${req.params.id}`))
    }

    let index = songs.indexOf(req.song);
    songs.splice(index, 1);
    res.status(200).json(req.song);
});

//Add error handler for songs router to return 404 on failure at any route
router.use((err, req, res, next) => {
    res.status(404).json({ message: err.message });
});

module.exports = router;