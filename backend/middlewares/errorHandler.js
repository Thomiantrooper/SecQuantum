// Not found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the error handler
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Set status code to 500 if it's currently 200
    res.status(statusCode);
    res.json({
        message: err.message,
        // Optionally include stack trace in development mode
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = {
    errorHandler,
    notFound
};
