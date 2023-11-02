const express = require('express')
const { Singup, Login, resetEmail, forgetPasswdset, ChangePassword, logout, UserProfile } = require('../controller/logger')
const { HomePageApi, LoginPage, SingupPage, ChangePasswdPage, ResetEmailPage, ResetPasswordPage } = require('../controller/publicLogger')
const { GetAddress, CreateAddress } = require('../controller/userController')

const auth = require('../middleware/auth')
const router = express.Router()

// ################ Api's #########################

router.post('/singup', Singup)
router.post('/login', Login)
router.post('/changepassword', auth, ChangePassword)
router.post('/resetmail', resetEmail)
router.post('/reset/:id/:token', forgetPasswdset)

router.get('/logout', auth, logout)
router.get('/profile', auth, UserProfile)

// ################ Address API ##################

router.get('/address', auth, GetAddress)
router.post('/address', auth, CreateAddress)

// ################ Pages #########################

// router.get('/', auth, HomePageApi)
router.get('/login', LoginPage)
router.get('/singup', SingupPage)
router.get('/changepassword', auth, ChangePasswdPage)
router.get('/resetemail', ResetEmailPage)
router.get('/reset/:id/:token', ResetPasswordPage)

module.exports = router
