const errorHandler = (err, req, res, next) => {
    if(err.errors){
        let errs = []
        err.errors.forEach(err => {
            if(err.path === 'email' && err.type === 'unique violation'){
                errs.push('Email already exists');
            }
        });
        res.status(err.status).json({msg: errs});
        return;

    }
    if(err.status){
        res.status(err.status).json({msg: err.message});
        return;
    }
    res.status(500).json({msg: err.message});
}

export default errorHandler;