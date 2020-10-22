const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const User = require('../schemas/user');
const auth = async (req, res, next) => {
    try {
        const token  = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, config.parametros.secret);

        // we look for an user that has that id and still have that token stored
        const user = await User.findOne({ _id: decoded.payload._id, 'tokens.token': token });
        if (!user) {
            throw new Error('Expired Token');
        }
        req.token = token;
        req.user = user; // we attach the user to the request object, this is a moongose document
        next();
    } catch (error) {
        res.status(401).json({error: 'Unauthorized to make this request'});
    }
};

module.exports = auth; 