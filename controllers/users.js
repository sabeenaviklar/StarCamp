const User = require('../models/user');

module.exports.renderRegister = async (req, res) => {
    res.render('users/register');
  }


module.exports.register = async ( req, res, next) => {
  try {
  const { email, username, password } = req.body;
  const user = new User({ email, username });
  const registeredUser = await User.register(user, password);
  req.login(registeredUser, err => {
    if (err) return next(err);
    req.flash('success', 'Welcome to Yelp Camp!');
    res.redirect('/campgrounds');
  })
  
  } catch(e) {
       req.flash('error', e.message);
       res.redirect('register')
  }
  
 
}

  //==============FOR LOGGING IN==========
module.exports.renderLogin =  (req, res) => {
    res.render('users/login');
 }

 //==============FOR LOGGING IN==========
module.exports.login = (req, res) => {
  req.flash('success', 'WELCOME BACK');
  const redirectUrl = req.session.returnTo  || '/campgrounds';
  res.redirect(redirectUrl);
  delete req.session.returnTo;
  
}


///==============for logout===========
module.exports.logout = function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
   req.flash('SUCCESS', 'logout successfully')
    res.redirect('/campgrounds')
  });
}