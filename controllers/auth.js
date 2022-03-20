const User = require('../models/user');

exports.getLogin = (req, res, next) => {
   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthOk: false
   });
};

exports.getSignup = (req, res, next) => {
   res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthOk: false
   });
};

exports.postLogin = (req, res, next) => {
   User.findById('61e2d2d83035113650e9e826')
      .then(user => {
         req.session.isLoggedIn = true;
         req.session.user = user;
         req.session.save(err => {
            console.log(err);
            res.redirect('/');
         });
      })
      .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => { };

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
   });
};