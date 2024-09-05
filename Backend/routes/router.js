const express = require('express');
const router = express.Router();

// Controller
const bookCtrl = require('../controllers/controller');

///// CRUD /////
// Create
router.post('/', bookCtrl.createBook);

// Read
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);

// Update
router.put('/:id', bookCtrl.modifyBook);

// Delete
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;