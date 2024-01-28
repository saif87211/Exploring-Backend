const express = require('express');
const router = express.Router();
const Joi = require('joi');

const movies = [{
    "id": 1,
    "movie": "God's Puzzle (Kamisama no pazuru)"
}, {
    "id": 2,
    "movie": "Tim and Eric's Billion Dollar Movie"
}, {
    "id": 3,
    "movie": "Bad Guy (Nabbeun namja)"
}, {
    "id": 4,
    "movie": "Down Argentine Way"
}, {
    "id": 5,
    "movie": "Epic"
}];
router.get('/', (req, res) => {
    res.send(movies);
});

router.get('/:id', (req, res) => {
    if (isNaN(req.params.id))
        return res.status(400).send('Please Enter valid id.');

    const movieObj = findMovie(req.params.id);

    if (!movieObj) {
        return res.status(404).send('Id not found');
    }
    res.send(movieObj);
});

router.post('/', (req, res) => {
    const { error, value } = movieValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const movie = {
        id: movies[movies.length - 1].id + 1,
        movie: value.movie
    }
    movies.push(movie);
    res.send(movie);
});

router.put('/:id', (req, res) => {
    if (isNaN(req.params.id))
        return res.status(400).send('Please Enter valid id.');

    const movieObj = findMovie(req.params.id);

    if (!movieObj) {
        return res.status(404).send('Id not found');
    }

    const { error, value } = movieValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    movieObj.movie = value.movie;
    res.send(movieObj);
});

router.delete('/:id', (req, res) => {
    if (isNaN(req.params.id))
        return res.status(400).send('Please Enter valid id.');

    const movieObj = findMovie(req.params.id);

    if (!movieObj) {
        return res.status(404).send('Id not found');
    }

    const index = movies.indexOf(movieObj);
    movies.splice(index, 1);

    res.send(movieObj);
});

function movieValidation(movie) {
    const schmea = Joi.object({
        movie: Joi.string().min(3).required()
    });
    return schmea.validate(movie)
}
function findMovie(Id) {
    return movies.find((m) => m.id === parseInt(Id))
}

module.exports = router;