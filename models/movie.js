const { genreSchema } = require('./genre');
const mongoose = require('mongoose');
const Joi = require('joi');

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    genre: [{ type: genreSchema, required: true }],
    numberInStock: { type: Number, required: true, min: 0, max: 200 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 200 },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    genreId: Joi.array().items(Joi.string()).required(),
    numberInStock: Joi.number().min(0).max(200).required(),
    dailyRentalRate: Joi.number().min(0).max(200).required(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
