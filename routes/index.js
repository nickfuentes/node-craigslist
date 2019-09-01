const express = require('express')
const router = express.Router()
const bcrpyt = require('bcrypt')
const models = require('../models')

const SALT_ROUNDS = 10

// GET shows the register page
router.get('/register', (req, res) => {
    res.render('register')
})

// POST creates a user in the database
router.post('/register', async (req, res) => {

    let username = req.body.username
    let password = req.body.password

    let persistedUser = await models.User.findOne({
        where: {
            username: username
        }
    })

    if (persistedUser == null) {

        bcrpyt.hash(password, SALT_ROUNDS, async (error, hash) => {
            if (error) {
                res.render('register', { message: "Error creating user!" })
            } else {
                let user = models.User.build({
                    username: username,
                    password: hash
                })

                let savedUser = await user.save()
                if (savedUser != null) {
                    res.redirect('/login')
                } else {
                    res.render('/register', { message: "User already exists!" })
                }
            }
        })
    } else {
        res.render('/register', { message: "User already exists!" })
    }

})

// GET shows the login page
router.get('/login', (req, res) => {
    res.render('login')
})

// POST logs in the user 
router.post("/login", async (req, res) => {

    let username = req.body.username
    let password = req.body.password

    let user = await models.User.findOne({
        where: {
            username: username
        }
    })

    if (user != null) {
        bcrpyt.compare(password, user.password, (error, result) => {

            if (result) {
                //create a session
                if (req.session) {
                    req.session.user = {
                        userId: user.id
                    }
                    res.redirect('users/products')
                }
            } else {
                res.render('login', { message: 'Incorrect username or password' })
            }
        })
    } else {
        res.render('login', { message: "Inccorect username or password" })
    }
})


module.exports = router