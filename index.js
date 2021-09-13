const express = require('express')
const expressConfig = require('./config/expressConfig')
const app = express()
const routes = require('./config/routes')
const database = require('./config/database')
const {init: storage} = require('./middleware/storage')
const auth = require('./middleware/auth')
async function start() {   
    
    await database(app)
    expressConfig(app)
    app.use(await storage())
    app.use(await auth(app))
    routes(app)
    app.listen(3000, () => console.log(`Server is listening on port 3000!`))
}
start()