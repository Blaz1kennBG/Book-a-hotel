const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    imgUrl: {type: String},
    freeRooms: {type: Number, min: 1, max: 100},
    owner: {type: String, ref: 'User'},
    ownerId: {type: String},
    bookedUsers: {type: Array, ref: 'User'}
})

module.exports = model('Hotel',schema)