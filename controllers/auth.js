const { Router } = require('express')
const {body, validationResult} = require('express-validator')

const router = Router()

router.get('/register', (req, res) => {
    res.render('register')

})
router.post('/register', 
body('username', 'Username field cant be empty.').notEmpty(),
body('email', 'Email field needs valid email.').isEmail(),
    
async (req, res) => {
    const {errors} = validationResult(req)
    try {
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'))
          }
        await req.auth.register(req.body)
        res.redirect('/')
        
    } catch (err) {
        console.log(err.message.split('\n'))
        res.render('register', {title: 'Register', error: err.message.split('\n')})
    }

})
router.get('/login', (req, res) => {
    res.render('login')
    
    
})
router.post('/login', async(req, res) => {
    await req.auth.login(req.body)
    res.redirect('/hotel')
})
router.get('/logout', async (req, res) => {
    await req.auth.logout()
})
router.get('/profile', async(req, res) => {
    
    let  user = await req.auth.getUserByUsername(req.user.username)
    let reservations = JSON.stringify(user.bookedHotels)
    reservations = JSON.parse(reservations)
  
    const userModel = {
        username: user.username,
        email: user.email,
        reservations
    }
    const ctx = {
        userModel
    }
    res.render('profile', ctx)
    
})
module.exports = router