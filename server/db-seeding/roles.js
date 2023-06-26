function seedDBRoles(db) {
    const Role = db.role;
    Role.estimatedDocumentCount().then((count) => {
        if(count === 0){
            new Role({
                name: 'user',
                isAdmin: false
            }).save();
    
            new Role({
                name: 'admin',
                isAdmin: true
            }).save();
            
        }
    })
}
module.exports= seedDBRoles;
