const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys= require('./keys');
const {google} = require('googleapis');


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
      clientSecret:keys.google.clientSecret,
      callbackURL: '/auth/google/redirect',
    },
    (accessToken, refreshToken,profile, done)=>{
      console.log(profile.user);
      User.findOne({$or:[{socialNetwork:{$elemMatch:{email:profile.emails[0].value.toLowerCase()}}},{socialNetwork:{$elemMatch:{googleId:profile.id}}}]},( err, user)=>{
        if(err) throw err;
        if (!user){
          const newUser = new User({
            username : profile.displayName.replace(/ .*/,'').toLowerCase(),
            lastname: profile.name.familyName,
            firstname: profile.name.givenName,
            socialNetwork:{
              googleId:profile.id,
              email : profile.emails[0].value.toLowerCase(),
            },
            avatar : profile.photos[0].value,
            active:false

          });
          User.createUser(newUser,(err, user)=>{
            if(err) throw err;
            done(null,user);
          });
        }else {
          if(user.active == true){
            done(null,user);
          }else{
            const userInfo= {$set:{
              username : profile.displayName.replace(/ .*/,'').toLowerCase(),
              lastname: profile.name.familyName,
              firstname: profile.name.givenName,
              socialNetwork:{
                googleId:profile.id,
                email : profile.emails[0].value.toLowerCase(),
              },
              avatar : profile.photos[0].value,
              active:false
  
            }};
            User.updateOne({socialNetwork:{$elemMatch:{email:profile.emails[0].value.toLowerCase()}}}, userInfo,(err)=>{
              if(err) throw err;
              done(null, user);
            });
          }
        }
      });
    }
  ));

  ///FacebookStrategy
  passport.use(new FacebookStrategy({
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: '/sign-up/facebook/redirect'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({$or:[{socialNetwork:{$elemMatch:{email:profile.email}}},{socialNetwork:{$elemMatch:{googleId:profile.id}}}]}, function( err, user){
        if(err) throw err;
        if (!user){
            User.findOne({$or:[{facebookId:profile.id},{email:profile.emails[0].value.toUpperCase()}]}, function(err, provider){
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
