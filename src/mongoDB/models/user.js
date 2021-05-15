const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
    }    
})

userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_PASSWORD)
    await user.save()
    return token
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('username')) {
      user.password = await bcrypt.hash(user.password, 8)
    } 
  next()  
})

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    if (!user) {
    throw new Error('This username doesn\'\t exist !')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
    throw new Error('Password is invalid !')
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User;