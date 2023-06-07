const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');



const users = new Schema({
    firstname: {
        type: String,
        required: [true],
        minLength: 3,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: [true],
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true],
        maxLength: 50,
        unique: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    },
    city: {
        type: String,
        required: [true],
        maxLength: 50
    },
    password: {
        type: String,
        required: [true],
        minLength: 6
    },
    isAdmin: {
        type: Boolean,
        value: false
    },
    cart: Array,
},
    { timestamps: true }
)

users.methods.isValidPassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then((isMatch) => {
      return isMatch
    })
    .catch((err) => {
      throw err
    })
}

module.exports = mongoose.model('users', users)