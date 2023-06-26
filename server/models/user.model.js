const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        name:{
            type: String,
            required: true,
            minlength: 3
         },
         email:{
            type: String,
            required: true,
            minlength: 5,
            unique: true
         },
         password:{
            type: String,
            required: true,
            minlength: 8 
         },
         role:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
         },
         preferredRecipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
         }]
    })
)

module.exports= User;
