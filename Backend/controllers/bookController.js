// Controller pour stocker la logique metier
const Book = require('../models/Book');
const fs = require('fs');
const average = require('./averageCalc.js');

///// CRUD /////
// Create
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Enregistrement dans la base de données
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

// Read
exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// Update
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json( {message : 'Non-autorise'});
            } else {
                Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
                .then (() => res.status(200).json({message : 'Livre modifie !'}))
                .catch (error => res.status(401).json({ error }));
            }
        })
};

// Delete
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non-autorise'})
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Livre supprime !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
};


// Gestion de la notation des livres

// Création d'une note
exports.createRating = (req, res, next) => {
    const ratingBook = { ...req.body, grade: req.body.rating };
    delete ratingBook._id;
    Book.findOne({ _id: req.params.id })
        .then(book => {
            const newRatings = book.ratings;
            const userIdArray = newRatings.map(rating => rating.userId);
            if (userIdArray.includes(req.auth.userId)) {
                return res.status(403).json({ message: 'Non autorisé !' });
            }
            newRatings.push(ratingBook);
            const grades = newRatings.map(rating => rating.grade);
            const averageGrades = average.average(grades);
            book.averageRating = averageGrades;
            Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades })
                .then(() => res.status(200).json(book))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};

// Recuperation et tri des 3 livres les mieux notes
exports.getBestBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
};
