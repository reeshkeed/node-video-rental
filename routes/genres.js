const { Genre, validate } = require('../models/genre');
const express = require('express');

const router = express.Router();

// GET: All genres sort by name
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// POST: Add Genre Route
router.post('/', async (req, res) => {
  // Validate request body
  // If request failed return 400
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Add genre if validation has no error
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

// PUT: update a genre
router.put('/:id', async (req, res) => {
  // Validate request
  // If invalid, return 400
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Find and update genre to database
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  // Find genre id to genres list
  // If not found return 404
  if (!genre) return res.status(404).send('Genre not found!');

  res.send(genre);
});

// DELETE: genre to list
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  // Find genre id to genres list
  // If not found return 404
  if (!genre) return res.status(404).send('Genre not found!');

  res.send(genre);
});

// GET: Return single genre route
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  // Find genre id to genres list
  // If not found return 404
  if (!genre) return res.status(404).send('Genre not found!');

  // Else return genre
  res.send(genre);
});

module.exports = router;
