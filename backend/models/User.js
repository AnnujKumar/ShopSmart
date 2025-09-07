
const mongoose = require('../database')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  role: { type: String, default: 'user' }
})
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10)
  }
  next()
})
userSchema.post('save', function(doc, next) {
  next()
})
userSchema.pre('findOne', function(next) {
  if (this._conditions && this._conditions.password) {
    this._conditions.password = bcrypt.hashSync(this._conditions.password, 10)
  }
  next()
})
userSchema.post('findOne', function(doc, next) {
  next()
})
module.exports = mongoose.model('User', userSchema)
