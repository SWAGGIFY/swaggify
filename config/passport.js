const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys= require('./keys');


//models
const User = require('../model/user');

module.exports = function(passport){
  /// serialize and deserialize starts
  passport.serializeUser((obj, done) => {
    if(obj instanceof User) {
      done(null, { id: obj.id, type: 'User'});
    } 
  });

  passport.deserializeUser((obj, done) => {
    if  (obj.type === 'User') {
      //User
      User.getUserById(obj.id,function(err, user){
        done(err, user);
      });
    }
  });

  ///Google Strategy
  passport.use(new GoogleStrategy({
      clientID:keys.google.clientID,
      callbackURL: '/sign-up/google/redirect',
      clientSecret:keys.google.clientSecret,
    },
    function(accessToken, refreshToken,profile, done) {
      User.findOne({$or:[{googleId:profile.id},{email:profile.emails[0].value.toUpperCase()}]}, function( err, user){
        if(err) throw err;
        if (!user){
            Provider.findOne({$or:[{googleId:profile.id},{email:profile.emails[0].value.toUpperCase()}]}, function(err, provider){
                  if (err) throw err;
                  if (provider){
                    done(null, provider);
                  }else {
                    const newUser = new User({
                          username : profile.displayName.replace(/ .*/,'').toUpperCase(),
                          lastname: profile.name.familyName,
                          firstname: profile.name.givenName,
                          googleId:profile.id,
                          email : profile.emails[0].value.toUpperCase(),
                          role:"new"

                        });
                        User.createUser(newUser, function(err, user){
                          if(err) throw err;
                          done(null,user);
                        });
                  }
                });
        }else {
          done(null, user);
        }
      });
        /*User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });*/
    }
  ));

  ///FacebookStrategy
  passport.use(new FacebookStrategy({
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: '/sign-up/facebook/redirect'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({$or:[{googleId:profile.id},{email:profile.emails[0].value.toUpperCase()}]}, function( err, user){
        if(err) throw err;
        if (!user){
            Provider.findOne({$or:[{facebookId:profile.id},{email:profile.emails[0].value.toUpperCase()}]}, function(err, provider){
                  if (err) throw err;
                  if (provider){
                    done(null, provider);
                  }else {
                    const newUser = new User({
                          username : profile.displayName.replace(/ .*/,'').toUpperCase(),
                          lastname: profile.name.familyName,
                          firstname: profile.name.givenName,
                          googleId:profile.id,
                          email : profile.emails[0].value.toUpperCase(),
                          role:"new"

                        });
                        User.createUser(newUser, function(err, user){
                          if(err) throw err;
                          done(null,user);
                        });
                  }
                });
        }else {
          done(null, user);
        }
      });
    }
  ));

  ////Local strategy
    passport.use(new LocalStrategy((username, password, done) =>{
      //Check
      console.log(username);
      var username= username.toLowerCase();
      User.getUserByUsername(username, function(err, user){
        if (err) throw err;
          if(!user){
            return done(null, false, {msg:"Unkown user"});
          }else {
            User.comparePassword(password, user.password, function(err, isMatch){
              if(err) throw err;
              if(isMatch){
                return done(null, user);
              } else{
                return done(null, false, {msg: 'Either username/password is Invalid'});
              }
          });
        }
      });
    }));
}
