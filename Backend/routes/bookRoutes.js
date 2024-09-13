const express = require('express');
const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../middleware/multer-config');
const router = express.Router();

// Controller
const bookCtrl = require('../controllers/bookController');

///// CRUD /////
// Create
router.post('/', auth, upload, resizeImage, bookCtrl.createBook);

// Read
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestBooks);
router.get('/:id', bookCtrl.getOneBook);

// Update
router.put('/:id', auth, upload, resizeImage, bookCtrl.modifyBook);

// Delete
router.delete('/:id', auth, bookCtrl.deleteBook);

// Notation
router.post('/:id/rating', auth, bookCtrl.createRating);

module.exports = router;