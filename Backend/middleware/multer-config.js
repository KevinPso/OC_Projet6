const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname
            .replace(/\./g, '') // Supprime les points
            .split(' ')
            .join('_'); // Remplace les espaces par des underscores
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');

module.exports.resizeImage = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path; // Chemin du fichier original
    const tempFilePath = path.join('images', `temp_${req.file.filename}`); // Fichier temporaire

    // Redimensionner l'image et l'enregistrer dans un fichier temporaire
    sharp(filePath)
        .resize({ width: 206, height: 260 })
        .toFile(tempFilePath)
        .then(() => {
            // Remplacer l'image originale par l'image redimensionnée
            fs.rename(tempFilePath, filePath, (err) => {
                if (err) {
                    console.error('Erreur lors du remplacement du fichier :', err);
                    return next(err);
                }
                next();
            });
        })
        .catch(err => {
            console.error('Erreur lors du redimensionnement de l\'image :', err);
            return next(err);
        });
};