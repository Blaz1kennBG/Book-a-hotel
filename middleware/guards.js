function isOwner() {
    return (req, res, next) => {
        if (req.user && req.data.hotel && req.user._id == req.data.hotel.owner._id) {
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
}
function isAuth() {
    return (req,res,next) => {
         if(req.user != undefined) {
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
}
function isGuest() {
    return (req, res, next) => {
        if(req.user == undefined) {
            
            next()
        } else {
            
            res.redirect('/hotel')
        }
    }
}
module.exports = {
    isOwner,
    isAuth,
    isGuest
}