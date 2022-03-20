require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MDBStore = require('connect-mongodb-session')(session);
const errorController = require('./controllers/error404');
const User = require('./models/user');

const exp = express();
const store = new MDBStore({
   uri: process.env.DB_URI,
   collection: 'sessions'
});

exp.set('view engine', 'ejs');

const adminRout = require('./routes/admin');
const boutiqueRout = require('./routes/boutique');
const authRout = require('./routes/auth');

exp.use(express.urlencoded({ extended: false }));
exp.use(express.static(path.join(__dirname, 'public')));
exp.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store
   }));

exp.use('/admin', adminRout);
exp.use(boutiqueRout);
exp.use(authRout);
exp.use(errorController.get404);

mongoose
   .connect(
      process.env.DB_URI
      , { useNewUrlParser: true, useUnifiedTopology: true })
   .then(result => {
      User.findOne()
         .then(user => {
            if (!user) {
               const user = new User({
                  name: 'Lilja',
                  email: 'lilja@luukku.com',
                  cart: {
                     items: []
                  }
               });
               user.save();
            }
         });
      exp.listen(3000);
   })
   .catch(err => {
      console.log(err);
   });