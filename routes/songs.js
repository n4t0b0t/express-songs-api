const Joi = require('Joi');
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
router.post('/', (req, res, next) => {
    const validation = validateSong(req.body)
    if(validation.error) {
        let error = new Error(validation.error.details[0].message)
        error.statusCode = 400
        return next(error); 
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
        let error = new Error(`Unable to find song with id: ${req.params.id}`)
        error.statusCode = 404
        return next(error)
    }
    res.status(200).json(req.song);
});

//update a song with id, and return edited song
router.put('/:id', (req, res, next) => {
    if(!req.song){
        let error = new Error(`Unable to update song with id: ${req.params.id}`)
        error.statusCode = 404
        return next(error)
    }

    const validation = validateSong(req.body)
    if (validation.error){
        let error = new Error(validation.error.details[0].message)
        error.statusCode = 400
        return next(error);
    }

    req.song.name = req.body.name;
    req.song.artist = req.body.artist;
    res.status(200).json(req.song);
});

//delete a song with id, and return deleted song
router.delete("/:id", (req, res, next) => {
    if(!req.song){
        let error = new Error(`Unable to delete song with id: ${req.params.id}`)
        error.statusCode = 404
        return next(error)
    }
    
    let index = songs.indexOf(req.song);
    songs.splice(index, 1);
    res.status(200).json(req.song);
});

//Add error handler for songs router to return error on failure at any route
router.use(function(err, req, res, next) {
    // If err has no error code, set error code to 500
    if (!err.statusCode){
        err.statusCode = 500; 
        err.message = { message: "Internal server error"}
    }

    // send back specified status code and message
    res.status(err.statusCode).json({ message : err.message}); 
});

function validateSong(song){
    const schema = {
        id: Joi.number().integer(),
        name: Joi.string().min(3).required(),
        artist: Joi.string().min(3).required()
    }
    return Joi.validate(song, schema);
}

module.exports = router;