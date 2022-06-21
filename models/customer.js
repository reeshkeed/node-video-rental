const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 400,
    },
    phone: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 13,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
  })
);

// Joi validation module for customer input
function validateCustomer(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(400).required(),
    phone: Joi.string().min(9).max(13).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(data);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
