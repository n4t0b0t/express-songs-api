
const Joi = require('joi')
const express = require('express');
const router = express.Router();

let songs = [];
const DELAY = 10

const getSongs = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(songs);
          }, DELAY);
    });
}

const createSong = (requestBody) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let newSong = {
                id: songs.length + 1,
                name: requestBody.name,
                artist: requestBody.artist 
            }

            songs.push(newSong);
            resolve(newSong)
        }, DELAY);
    });
}

const getSong = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let songFound = songs.find(song => song.id == parseInt(id));
            if (!songFound){
                reject(new Error(`Unable to find song with id: ${id}`))
            }
            return resolve(songFound);
        }, DELAY);
    })
}

const updateSong = (requestBody, songToUpdate) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            songToUpdate.name = requestBody.name;
            songToUpdate.artist = requestBody.artist;
            resolve(songToUpdate)
        }, DELAY);
    });
}

const deleteSong = (songToDelete) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(!songToDelete) {
                reject(new Error())
            }

            let index = songs.indexOf(songToDelete);
            songs.splice(index, 1);
            resolve(songToDelete);
        }, DELAY)
    })
}

//Song API
router.param('id', async (req, res, next, id) => {
    try{
        req.song = await getSong(id);
        next();
    }
    catch(error){
        error.statusCode = 404;
        next(error);
    }
});

//return list of all songs
router.get('/', async (req, res, next) => {
    try{
        let allsongs = await getSongs();
        res.status(200).json(songs);
    }
    catch(error){
        res.status(404).json({message: "unable to list all songs"})
    }
});
  
router.post('/', async (req, res, next) => {
    try{
        const validation = validateSong(req.body)
        if(validation.error) {
            let error = new Error(validation.error.details[0].message)
            error.statusCode = 400;
            return next(error); 
        } 

        newSong = await createSong(req.body);
        res.status(201).json(newSong);
    }
    catch(error){
        error.statusCode = 404
        return next(error);
    }
  });

//return a song with id 
router.get('/:id', (req, res, next) => {
    try {
        res.status(200).json(req.song);
    }
    catch(error){
        next(error);
    }
});

//edit a song with id, and return edited song
router.put('/:id', async (req, res, next) => {
    try{
        const validation = validateSong(req.body);
        if(validation.error) {
            let error = new Error(validation.error.details[0].message);
            error.statusCode = 400;
            return next(error); 
        } 

        let song = await updateSong(req.body, req.song);
        res.status(200).json(song);
    }
    catch(error){
        error.statusCode = 404;
        next(error);
    }
});

//delete a song with id, and return deleted song
router.delete("/:id", async (req, res, next) => {
    try{
        let songDeleted = await deleteSong(req.song)
        res.status(200).json(songDeleted);
    }
    catch(error){
        res.status(404).json({message: `Unable to delete song with id: ${req.params.id}` })
    }
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