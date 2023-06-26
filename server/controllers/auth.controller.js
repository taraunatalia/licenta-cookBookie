const jwt = require('jsonwebtoken');
const db = require('../models');
const bcrypt =require('bcryptjs');
const Role = require('../models/role.model');

const User= db.user;

exports.signup = async (req, res)=> {
    try{
        const role = await Role.findOne({ name: 'user' }).exec();
        const user = await new User({
            name: req.body.name?.trim(),
            email: req.body.email?.trim(),
            password: bcrypt.hashSync(req.body.password?.trim(), 8),
            role: role._id
        }).save();
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        res.status(200).send({ message: 'Success', token});

    }catch(err){
        res.status(500).send({ message: err });
    }
}

exports.signin = (req, res)=> {
    User.findOne({
        email: req.body.email?.trim(),
    }).populate('role')
    .exec().then(user=>{
        if(!user){
            res.status(401).send({message: 'Wrong email or password'});
            return;
        }
        const passwordIsValide= bcrypt.compareSync(
            req.body.password?.trim(),
            user.password
        );
        if(!passwordIsValide){
            res.status(401).send({message: 'Wrong email or password'});
            return;
        };

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        res.status(200).send({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.role.isAdmin,
            token
        })
    })
}