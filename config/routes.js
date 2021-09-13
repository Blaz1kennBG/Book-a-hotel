const hotelController = require('../controllers/hotel')
const authController = require('../controllers/auth')

module.exports = (app) => {
app.get('/', (req, res) => res.redirect('/hotel'))
app.use('/hotel', hotelController)
app.use('/auth', authController)

}