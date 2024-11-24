

const errorHandler = (err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }

    const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

    res.status(statusCode);

    //log error stack trace to the console if not in production mode for debugging

    if (process.env.NODE_ENV !== "production") {
        console.log(err);
    }

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })

}

export default errorHandler
