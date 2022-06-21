const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

// GET: All movies
router.get('/', async (req, res) => {
  const movies = await Movie.find();

  res.send(movies);
});

// POST: Add movie
router.post('/', async (req, res) => {
  // Validate request body
  // If request failed return 400
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Validate genre ID(s) exist
  // IF any id not exist return 400
  const genres = await Genre.find({
    _id: { $in: req.body.genreId },
  });

  if (genres.length !== req.body.genreId.length)
    return res.status(400).send('Invalid genre.');

  // Else add movie
  let movie = new Movie({
    title: req.body.title,
    genre: genres.map((genre) => ({
      _id: genre._id,
      name: genre.name,
    })),
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();

  res.send(movie);
});

// PUT: Add new genre to movie
router.put('/:id', async (req, res) => {
  // Validate movie ID
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status.send('Movie not found.');

  // Find input genreId
  // If one of id does not exist return 400
  const genres = await Genre.find({
    _id: { $in: req.body.genreId },
  }).select('name _id');
  if (genres.length !== req.body.genreId.length)
    return res.status(400).send('Invalid genre.');

  // Filter genreId to movie genres array object
  // If id already exist remove
  const filterGenres = genres.filter(
    (genre) =>
      !movie.genre.some((existingGenre) => existingGenre.id === genre.id)
  );

  // If all genreId existing on the movie return 200
  if (filterGenres.length === 0)
    return res
      .status(200)
      .send(`You're trying to add genre(s) that is already on this movie.`);

  // else update data
  filterGenres.map((item) => movie.genre.push(item));
  movie.save();

  res.send(movie);
});

// PUT: genre to movie genres
router.put('/:id', async (req, res) => {
  // Validate movie ID
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status.send('Movie not found.');
});

// DELETE: movie to list
router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  // Find movie id to movies list
  // If not found return 404
  if (!movie) return res.status(404).send('Movie not found.');

  res.send(movie);
});

// GET: Return single movie route
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  // Find movie id to movies list
  // If not found return 404
  if (!movie) return res.status(404).send('Movie not found!');

  // Else return movie
  res.send(movie);
});

module.exports = router;
