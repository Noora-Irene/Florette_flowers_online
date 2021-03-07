require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const errorController = require('./controllers/error404');
const User = require('./models/user');

const exp = express();

exp.set('view engine', 'ejs');

const adminRout = require('./routes/admin');
const boutiqueRout = require('./routes/boutique');

exp.use(express.urlencoded({ extended: false }));
exp.use(express.static(path.join(__dirname, 'public')));

exp.use((req, res, next) => {
   User.findById('6044eeccd29b8936545268a4')
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
});

exp.use('/admin', adminRout);
exp.use(boutiqueRout);
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