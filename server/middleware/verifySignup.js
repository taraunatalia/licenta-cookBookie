const db = require('../models');

const User = db.user;

const checkDuplicateEmail = (req, res, next)=>{
    User.findOne({
        email: req.body.email,

    }).exec().then(user=>{
        if(user){
            res.status(400).send({ message: 'Email is already in use!'});
            return;
        }
        next();
    }).catch(err=>{
        res.status(500).send({message: err});
    })
}


module.exports = checkDuplicateEmail;