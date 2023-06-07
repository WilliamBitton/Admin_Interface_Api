const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categories = new Schema({
    name: {
        type: String,
        required: [true],
        maxLength: 50
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('categories', categories)