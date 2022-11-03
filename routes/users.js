const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users')


router.route('/register')
     ///============FOR REGISTERING THE USER=======
    .get( users.renderRegister)
    .post( catchAsync(users.register))


router.route('/login')
     //==============FOR LOGGING IN==========
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true , failureRedirect: '/login'}), users.login)


// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/campgrounds');
// })


///==============for logout===========
router.get('/logout', users.logout);
  

module.exports = router;