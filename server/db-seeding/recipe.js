const User = require('../models/user.model');
function seedRecipe(db) {
    //const User = db.user;
    const Recipe = db.recipe;
    Recipe.estimatedDocumentCount().then((count) => {
        if(count === 0){
         new Recipe({
            name: 'cheesecake',
            rating: 4,
            category: 'Deserturi',
            servings: 12,
            ingredients: '240 g unt, 200 g biscuiti, 100 g zahar, 400 g branza de vaca, 400 g crema de branza, 5 oua, esetnta de vanilie, 200 g smanatna, 400 g zmeura',
            cookingTime: '2 h',
            difficulty: 'mediu',
            description: 'Mixam biscuitii cu zaharul si ii amestecam cu untul topit. Punme intr-o tava la cuptor la 160  grade timp de 10 min. MIxam separta celelalte ingrediente pe rand incepand cu ouale. Pe urma adaugam pe rand fiecare ingredient. Punem compozitia peste blatul de biscuiti racit si introducem tava la cuptor timp de o ora la 160 grade. Pe urma punem zmeura la foc si dupa ce s0a racit o putem pune peste prajitura. Lasati la frigider timp de minim 3 ore.',
            imageCover: 'awda',
            private: false
            

         }).save().then((recipe)=>{
            User.findOne({ name: "natalia"}).then((user) => {
                recipe.user = user._id;
                recipe.save();
            })
         })
        }
    })
}
module.exports= seedRecipe;