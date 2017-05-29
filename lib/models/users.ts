const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');

var userSchema = Mongoose.Schema({
    local: {
        email: String,
        password: String,
    },
    username: String,
    role: String
});

userSchema.methods.generateHash = function(password: string) {
    return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password: string) {
    return Bcrypt.compareSync(password, this.local.password);
};

export default Mongoose.model('Users', userSchema);