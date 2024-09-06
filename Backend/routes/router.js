const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Controller
const bookCtrl = require('../controllers/controller');

///// CRUD /////
// Create
router.post('/', auth, bookCtrl.createBook);

// Read
router.get('/', auth, bookCtrl.getAllBooks);
router.get('/:id', auth, bookCtrl.getOneBook);

// Update
router.put('/:id', auth, bookCtrl.modifyBook);

// Delete
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;