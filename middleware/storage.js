const hotelService = require('../services/hotel')

async function init() {
    return async(req, res, next) => {
        
        const storage = Object.assign({}, hotelService)
        req.storage = storage
        next()
    }
}


module.exports = {
    init
}
