const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const path = require('path')
const models = require('./models')
const session = require('express-session')
const indexRoutes = require('./routes/index')

const PORT = 3000
const VIEWS_PATH = path.join(__dirname, '/views')

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized: false
}))

app.use('/', indexRoutes)




app.listen(PORT, () => {
    console.log('Server is running...')
})