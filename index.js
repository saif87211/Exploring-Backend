const express = require('express');
const Joi = require('joi');

const app = express();

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

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Movies List...');
});

app.get('/api/movies', (req, res) => {
    res.send(movies);
});

app.get('/api/movies/:id', (req, res) => {
    if (isNaN(req.params.id))
        return res.status(400).send('Please Enter valid id.');

    const movieObj = findMovie(req.params.id);

    if (!movieObj) {
        return res.status(404).send('Id not found');
    }
    res.send(movieObj);
});

app.post('/api/movies', (req, res) => {
    const { error, value } = movieValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const movie = {
        id: movies[movies.length-1].id + 1,
        movie: value.movie
    }
    movies.push(movie);
    res.send(movie);
});

app.put('/api/movies/:id', (req, res) => {
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

app.delete('/api/movies/:id', (req, res) => {
    if (isNaN(req.params.id))
        return res.status(400).send('Please Enter valid id.');

    const movieObj = findMovie(req.params.id);

    if (!movieObj) {
        return res.status(404).send('Id not found');
    }

    const index = movies.indexOf(movieObj);
    movies.splice(index,1);

    res.send(movieObj);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}....`));

function movieValidation(movie) {
    const schmea = Joi.object({
        movie: Joi.string().min(3).required()
    });
    return schmea.validate(movie)
}
function findMovie(Id) {
    return movies.find((m) => m.id === parseInt(Id))
}