const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Recuperation du token du header Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Decodage du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};