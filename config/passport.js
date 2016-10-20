const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = passport => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup',
    new LocalStrategy({

      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(() => {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, (err, user) => {

          // if there are any errors, return the error
          if (err) return done(err);

          // check to see if theres already a user with that email
          if (user) {
            return done(null, false, {message: 'That email is already taken.'});
          } else {
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.save(err => {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      });
    })
  );

  passport.use('local-login',
    new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    }, (req, email, password, done) => {
      User.findOne({ 'local.email' :  email }, (err, user) => {
        if (err) return done(err);

        // if no user is found, return the message
        if (!user) {
          return done(null, false, {message: 'Such user isn\'t found'}); // req.flash is the way to set flashdata using connect-flash
        }

        // if the user is found but the password is wrong
        if (!user.validPassword(password)) {
          return done(null, false, {message: 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata
        }
        done(null, user);
      });
    })
  );

};
