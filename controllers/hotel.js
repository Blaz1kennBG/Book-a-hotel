const { Router } = require('express')
const {body, validationResult} = require('express-validator')
const {preloadHotel} = require('../middleware/preload')
const {isAuth,isGuest,isOwner} = require('../middleware/guards')
const router = Router()

router.get('/', async(req, res) => {
    const ctx = {
        hotels: await req.storage.getAllHotels()
    }
    res.render('home', ctx)
    
})

router.get('/create', (req, res) => {
    res.render('create', {title: 'Create a hotel'})
})

router.post('/create', 
body('name', 'Hotel name field cant be empty').notEmpty(),
body('city', 'City name field cant be empty').notEmpty(),
body('imgUrl', 'Image url field cant be empty').isURL(),
body('freeRooms', 'Free rooms must be between 1 and 100').isInt({min: 1, max: 100}),
async (req, res) => {
    const {errors} = validationResult(req)
    try {
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'))
          }
          const hotel = {
            name: req.body.name,
            city: req.body.city,
            freeRooms: req.body.freeRooms,
            imgUrl: req.body.imgUrl,
            ownerId: req.user._id,
            owner: req.user._id,
            bookedUsers: []
          }
    await req.storage.createHotel(hotel)
    res.redirect('/')
    } catch (err) {
        console.log(err.message.split('\n'))
       return res.render('create', {title: 'Create hotel', error: err.message.split('\n')})
    }
})

router.get('/details/:id', preloadHotel(),async(req, res) => {
    const hotel = req.data.hotel 
    const ctx = {
        hotel,
       
    }
    if (req.user) {
      
        const user = await req.auth.getUserByUsername(req.user.username)
        ctx.owner = req.user._id == hotel.ownerId, //x == req.params.id
        ctx.booked = user.bookedHotels.find(x => x._id == user._id) ? true : false
        ctx.hasUser = true
        console.log(user)
    }
    
    

    res.render('details', ctx)
})

router.get('/details/:id/edit', preloadHotel(), async (req, res) => {
    const hotel = req.data.hotel
    
    hotel.isOwner = req.user && (hotel.owner._id == req.user._id)
    const ctx = {
        hotel,

    }
    
   
    res.render('edit', ctx)
})
router.post('/details/:id/edit', 
body('name', 'Hotel name field cant be empty').notEmpty(),
body('city', 'City name field cant be empty').notEmpty(),
body('imgUrl', 'Image url field cant be empty').isURL(),
body('freeRooms', 'Free rooms must be between 1 and 100').notEmpty().isInt({min: 1, max: 100}),
async (req, res) => {
    const {errors} = validationResult(req)
    try {
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'))
          }
          const hotel = {
            name: req.body.name,
            city: req.body.city,
            freeRooms: req.body.freeRooms,
            imgUrl: req.body.imgUrl
          }
          

       await req.storage.updateHotel(hotel, req.params.id)
       res.redirect(`/hotel/details/${req.params.id}`)
    } 
    catch (err) {
        console.log(err.message.split('\n'))
        return res.render('edit', {title: 'Edit hotel', error: err.message.split('\n')})
    }
})
router.get('/details/:id/book',
isAuth(),
preloadHotel(),
async (req, res) => {
  
    const hotel = req.data.hotel
   await req.storage.bookHotel(req.user, hotel)

})
module.exports = router