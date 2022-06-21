const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
});

const Genre = mongoose.model('Genre', genreSchema);

// Validation function
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
  });

  return schema.validate(genre);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
