const express = require('express')
const expressSession = require('express-session')
const expressLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
// Importing Router
const router = require('./router')

// initilaizing Express 
const app = express()

// --APP Config-- //
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))
// app.use(morgan('dev'))
// Config sessions and cookie 
app.use(expressSession({
    secret: process.env.expressSecret,
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

// SET Template Engine
app.use(expressLayout)
app.set("layout", "./layouts/main")
app.set("view engine", "ejs")

// Application Routing
app.use(router)

// Application PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening on http://localhost:${port}`))