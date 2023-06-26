require('dotenv').config();

const express= require('express');
const cors= require('cors');

const app = express();
const db = require('./models');
const dbConfig = require('./db.config');
const seedDBRoles = require('./db-seeding/roles');
const seedAdmin = require('./db-seeding/admin');
const seedRecipe = require('./db-seeding/recipe');

app.use(cors({
    origin: '*'
}));
app.use(express.json());

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log('Successfully connected to MongoDB!');
    seedDBRoles(db);
    seedAdmin(db);
    seedRecipe(db);

}).catch((err)=>{
    console.error('Connection error', err);
    process.exit();
});

//Add routes
require('./routes/auth.route')(app);
require('./routes/user.route')(app);
require('./routes/admin.route')(app);
require('./routes/recipe.route')(app);
require('./routes/rating.route')(app);

app.listen(8080, ()=> {
    console.log('Server is running on port 8080!');
});
