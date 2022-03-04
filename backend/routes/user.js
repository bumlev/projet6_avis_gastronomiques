/// Import Expres
const express = require('express');

/// Create router
const router =  express.Router();

/// import  userCtrl
const userCtrl = require('../controllers/user');

// validation of email
const email_validation = require('../Validation/email_validation');

// Limit essay connexion
const rateLimit = require('express-rate-limit')
const limit = rateLimit({
    windowMs: 4 * 60 * 1000,
    max:5,
    message:"Too many accounts created from this IP , please try again after an hour"
})

// Create route.post for Signup
router.post('/signup' , email_validation , userCtrl.signup);
router.post('/login' , limit , userCtrl.login);

module.exports = router;