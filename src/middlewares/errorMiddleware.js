const errorMiddleware = (req, res, next) => {
    throw new Error('Error from my middleware error handler');
}

module.exports = errorMiddleware;