const Hotel = require('../models/Hotel')
const User = require('../models/User')

function createHotel(data) {
    
        const hotel = new Hotel(data)
        
        return hotel.save()

} 
async function getAllHotels() {
    return await Hotel.find({}).populate('owner').lean()
}
async function getHotelById(id) {
    return await Hotel.findById(id).lean()
}
async function updateHotel(data, id) {
    const hotel = await Hotel.findById(id)
    Object.assign(hotel, data)
    hotel.save()
}
async function bookHotel(bookUser, hotel) {
       const user = await User.findOne({ username: {$regex: bookUser.username, $options: 'i'} })
        const realHotel = await Hotel.findById(hotel._id)
      user.bookedHotels.push(hotel._id)
      await user.save()
      realHotel.bookedUsers.push(user._id) 
      await realHotel.save()
      console.log(`${user.username} booked ${realHotel.name}`)
  }
module.exports = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    bookHotel
}