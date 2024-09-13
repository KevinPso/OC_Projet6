const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'webp',
    'image/jpeg': 'webp',
    'image/png': 'png',
    'image/webp': 'webp'
};

// Middleware de stockage avec fileFilter pour les formats acceptés
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname
            .replace(/\./g, '') // Supprime les points
            .split(' ').join('_'); // Remplace les espaces par des underscores
        const timestamp = Date.now();
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${name}${timestamp}.${extension}`);
    }
});

// Fonction pour filtrer les formats de fichiers acceptés
const fileFilter = (req, file, callback) => {
    if (!MIME_TYPES[file.mimetype]) {
        return callback(new Error('Seuls les formats jpg, png et webp sont acceptés !'), false);
    }
    callback(null, true);
};

// Configuration de multer avec le filtre
const upload = multer({ 
    storage, 
    fileFilter 
}).single('image');

// Middleware pour redimensionner l'image
const resizeImage = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const filePath = req.file.path;
    const tempFilePath = path.join('images', `temp_${req.file.filename}`);

    // Redimensionnement de l'image et enregistrement dans un fichier temporaire
    sharp(filePath)
        .resize({ width: 206, height: 260 })
        .toFile(tempFilePath)
        .then(() => {
            // Remplacement de l'image originale par l'image redimensionnée
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

module.exports = { upload, resizeImage };