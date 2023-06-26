const mongoose = require('mongoose');

const Recipe = mongoose.model(
    'Recipe',
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number
        },
        category: {
            type: String,
            required: true,
        enum: {
            values: [
            'Aperitive',
            'Ciorbe si Supa',
            'Feluri principale',
            'Deserturi'
            ],
            message:
            'Category is either: Aperitive, Ciorbe si Supa, Feluri principale, Deserturi'
        }
        },
        servings: {
            type: Number
        },
        ingredients: {
            type: String,
            required: true
        },
        cookingTime: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            required: true,
            enum: {
                values: ['usor', 'mediu', 'dificil'],
                message: 'Difficulty is either: usor, mediu, dificil'
            }
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        imageCover: {
            data: Buffer,
            contentType: String
        },
        private:{
            type: Boolean,
            required:true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    })
);



module.exports = Recipe;