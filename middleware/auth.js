const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userService = require('../services/user')
const User = require('../models/User')

module.exports = () => (req, res, next) => {
    req.auth = {
    register,
    login,
    logout,
    getUserByUsername
    }
    if (readToken(req)) {
        next()
    } 
  

    

async function register({email, username, password}) {
  const hashedPassword = await bcrypt.hash(password, 10)
   const user = await userService.createUser(email, username, hashedPassword)
   req.user = createToken(user)
}
async function login({ username, password }) {
   
    const user = await userService.getUserByUsername(username)
    console.log(user)
    if (user == null) {
        throw new Error('Wrong username or password')
    } else {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error("Wrong username or password")
        } else {
            req.user = createToken(user)
        }
    }
}
function createToken(user) {
    const userViewModel = { _id: user._id, username: user.username }
    const token = jwt.sign(userViewModel, 'my-very-secret')
    res.cookie('SESSION_DATA', token, { httpOnly: true })
    return userViewModel
}
async function logout() {
    res.clearCookie('SESSION_DATA')
    res.redirect('/hotel')
}
function readToken(req) {
     const token = req.cookies['SESSION_DATA']
    if (token) {
        try {
            const userData = jwt.verify(token, 'my-very-secret')
            req.user = userData
            res.locals.user = userData
           
        } catch (err) {
            res.clearCookie('SESSION_DATA')
            res.redirect('/auth/login')
            return false
        }
    }
    return true
}
}


async function getUserByUsername(username) {
    return await User.findOne({ username: {$regex: username, $options: 'i'} }).populate('bookedHotels')
}



