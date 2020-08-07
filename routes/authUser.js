const jwt = require('jsonwebtoken');
require('dotenv').config();

const authUser = (req, res, next)=>{
    const token = req.header('auth-token');
    if(!token) res.status(404).json('auth-token not provided');
    try{
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        console.log('Verification Successfull');

    } catch(err){
        res.status(400).json('Invalid auth token');
    }
    next();
}

module.exports = {authUser};