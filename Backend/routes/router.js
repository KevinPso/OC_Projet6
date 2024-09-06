const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

// Controller
const bookCtrl = require('../controllers/controller');

///// CRUD /////
// Create
router.post('/', auth, multer, bookCtrl.createBook);

// Read
router.get('/', auth, bookCtrl.getAllBooks);
router.get('/:id', auth, bookCtrl.getOneBook);

// Update
router.put('/:id', auth, multer, bookCtrl.modifyBook);

// Delete
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;