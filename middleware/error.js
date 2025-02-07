const errorHandler = (err, req, res, next) => {
    if(err.status){
        res.status(err.status).json({msg_midlleware: err.message});
        return;
    }
    res.status(500).json({msg_midlleware: err.message});
}

export default errorHandler;