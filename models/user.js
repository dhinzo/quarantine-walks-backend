const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    image: { type: String, required: true },
    // wrap document field in an array to tell Mongoose that there will be multiple docs
    walks: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Walk' }]
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)