const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
    userName : {
        type: 'String',
        lowercase: true,
        required: true,
        unique: true
    },
    email : {
        type: 'String',
        required: true,
        unique: true,
        index: {unique: true}
    },
    password : {
        type: 'String',
        required: true,
    },
    type : {
        type: 'String',
        default: 'user'
    },
    tokenConfirm: {
        type: 'String',
        default: null
    },
    confirmAccount: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next){
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        console.log(error);
        throw new Error('Error al codificar la contraseña')
    }
})

userSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}
const User = mongoose.model('User', userSchema);
module.exports = User;