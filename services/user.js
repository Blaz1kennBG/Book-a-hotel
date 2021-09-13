const User = require('../models/User')
module.exports = {
    createUser,
    getUserByUsername,
    
}

async function createUser(email, username, password) {
const user = new User({
    email,
    username,
    password,
    bookedHotels: [],
    offeredHotels: []
})
user.save()
return user
}
async function getUserByUsername(username) {
    return await User.findOne({ username: {$regex: username, $options: 'i'} })
}
