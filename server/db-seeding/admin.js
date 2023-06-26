const bcrypt = require('bcryptjs');

function seedAdmin(db) {
    const User = db.user;
    const Role = db.role;
    User.estimatedDocumentCount().then((count) => {
        if(count === 0){
         new User({
            name: 'admin',
            email: 'admin@yahoo.com',
            password: bcrypt.hashSync('admin123', 8)

         }).save().then((user)=>{
            Role.findOne({ isAdmin: true}).then((role) => {
                user.role = role._id;
                user.save();
            })
         })
        }
    })
}
module.exports= seedAdmin;