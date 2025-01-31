const notFound = (req, res, next) => {
    const error = new Error('Opps! endpoint not found');
    error.status = 404;
    next(error);
}

export default notFound;