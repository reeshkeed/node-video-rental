const { Customer, validate } = require('../models/customer');
const express = require('express');

const router = express.Router();

// GET: All customers
router.get('/', async (req, res) => {
  const customer = await Customer.find();

  res.send(customer);
});

//POST: add customer
router.post('/', async (req, res) => {
  // Validate user input
  // If validation did not pass return 400 and display error
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Else save to the database and return the data
  let customer = new Customer(req.body);
  customer = await customer.save();

  res.send(customer);
});

// PUT: update customer data
router.put('/:id', async (req, res) => {
  // Validate user input
  // If validation did not pass return 400 and display error
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find id and update
  // If id invalid return 404
  // Else save and return updated data
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!customer) return res.status(404).send('Invalid customer ID.');

  res.send(customer);
});

// DELETE: remove a customer
router.delete('/:id', async (req, res) => {
  // Find id and remove if found
  // Else return 400
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(400).send('Invalid customer ID.');

  res.send(customer);
});

// GET: Return single genre route
router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  // Find genre id to genres list
  // If not found return 404
  if (!customer) return res.status(404).send('Invalid customer ID.');

  // Else return genre
  res.send(customer);
});

module.exports = router;
