const {Schema, model} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
   bookedHotels: {type: Array, ref: 'Hotel'},
   offeredHotels: {type: Array, ref: 'Hotel'}
})

module.exports = model('User',schema)