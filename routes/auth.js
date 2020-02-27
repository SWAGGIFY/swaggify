const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require ('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
//models
const User= require('../model/user');

//Google handler
///Signing up using google Account(google strategy)
router.get('/google',
passport.authenticate('google', {
  scope: [//'profile','email'
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

///Google account
router.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res)=>{
    if(req.user.role =="Admin"){
      res.redirect('/admin/admin-dashboard');
    }else if (req.user.role =="Supplier") {
        if(req.user.active == false){
            res.redirect('/auth/supplier-verify-account');
        }else{
            res.redirect('/supplier/supplier-dashboard');
        }
    }else if(req.user.role =="Artist") {
        if(req.user.active == false){
            res.redirect('/auth/artist-verify-account');
        }else{
            res.redirect('/artist/artist-dashboard');
        }
    }else{
        if(req.user.active == false){
            res.redirect('/auth/user-verify-account');
        }else{
            res.redirect('/customer/customer-dashboard');
        }
    }
});

///Endle google handler
//acount verification
router.get('/artist-verify-account', ensureAuthentication, (req, res)=>{
    res.render('./homefiles/accountVerification/artist',{
        user:req.user, 
        layout:"../layouts/verifyAccount.handlebars"
    });
});

router.get('/supplier-verify-account', ensureAuthentication, (req, res)=>{
    res.render('./homefiles/accountVerification/supplier',{
        user:req.user, 
        layout:"../layouts/verifyAccount.handlebars"
    });
});

router.get('/user-verify-account', ensureAuthentication, (req, res)=>{
    res.render('./homefiles/accountVerification/user',{
        user:req.user, 
        layout:"../layouts/verifyAccount.handlebars"
    });
});

router.post('/verify-account', ensureAuthentication, [
    // password must be at least 5 chars long
    check('pwd').isLength({ min: 5 })
    .withMessage('The password must be 5+ chars long and contain a number')
    .matches(/\d/)
    .withMessage('must contain a number')
    .custom((value,{req, loc, path}) => {
        if (value !== req.body.pwd1) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })
  ], (req, res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }else{
        User.getUserById(req.user.id, (err, user)=>{
            if (err) throw err;
            if(user){
                var pwd =req.body.pwd;
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(pwd, salt, (err, hash)=>{
                    pwd = hash;
                    const query={$set:{
                        address:{
                            address:req.body.address,
                            city:req.body.city,
                            country:req.body.country,
                            contact:req.body.contact
                        },
                        company:{
                            company_name:req.body.company_name,
                            email:req.body.compan_email,
                            city : req.body.company_city,
                            country: req.body.company_country,
                            postalcode : req.body.postalcode,
                            description: req.body.description,
                            tel : req.body.tel,
                            mobile : req.body.mobile,
                            address : req.body.company_address
                        },
                        password : pwd,
                        active:true
                    }};
                    User.updateOne({_id:req.user.id},query , (err)=>{
                        if (err) throw err;
                        if(user.role =="Admin"){
                            res.redirect('./admin/admin-dashboard');
                        }else if(user.role =="Artist"){
                            res.redirect('/artist/artist-dashboard');
                        }else if(user.role =="Supplier"){
                            res.redirect('/supplier/supplier-dashboard');
                        }else{
                            res.redirect('/customer/customer-dashboard');
                        }
                        });
                    });
                });
            }else{
                return res.status(422).json("Error changing password");
            }
        });
    }
});
 //End account verification

///get signin 
router.get('/sign-in',(req,res)=>{
    res.render('./homefiles/sign-in',{
        layout:false
    });
});
//Register user
router.post('/sign-up',[
    //check('email').isEmail(),
    check('firstname').isLength({ min: 2 }),
    check('pwd').exists()
    .isLength({ min: 4 }).withMessage('Must be a minimum of 4')
    .isAlphanumeric()
    .withMessage('Must be only alphabetical chars'),
    check('pwd1','Passwords do not match').exists()
    .custom((value, { req }) => value === req.body.pwd)
],(req, res)=>{
    User.find({},(err,user)=>{
        if(err) throw err;
        const newUSer = new User({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            password : req.body.pwd,
            socialNetwork : [{
                email:req.body.email.toLowerCase(),
            }],
            role : "Admin"
        });
        if(!user){
            const errors = validationResult(req);
            if (errors) {
                return res.status(422).json({ errors: errors.array() });
            }else{
                console.log(req.body.email);
                User.createUser(newUSer,(err)=>{
                    if (err) throw err;
                    const alert = "alert alert-success";
                    const msg = "Successfully added";
                    res.render('./homefiles/index',{
                        alert:alert,
                        msg: msg
                    });
                });
            }
        }else{
            res.render('./homefiles/sign-in',{
                alert:"alert alert-danger",
                msg:"Please log in to the system",
            })
        }
    });
});

//Password management
router.post('/password-settings',ensureAuthentication, [
    // password must be at least 5 chars long
    check('pwd').isLength({ min: 5 })
    .withMessage('The password must be 5+ chars long and contain a number')
    .matches(/\d/)
    .withMessage('must contain a number')
    .custom((value,{req, loc, path}) => {
        if (value !== req.body.pwd1) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })
  ], (req, res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }else{
        User.getUserById(req.user.id, (err, user)=>{
            if (err) throw err;
            if(user){
                var pwd =req.body.pwd;
                User.comparePassword(req.body.cpwd, user.password, (err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                      bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(pwd, salt, (err, hash)=>{
                            pwd= hash;
                          User.updateOne({_id:req.user.id},{$set:{ password:pwd}} , (err)=>{
                            if (err) throw err;
                            if(user.role =="Admin"){
                                res.render('./admin/admin-dashboard',{
                                    user:user,
                                    msg:"Successfully changed your password",
                                    alert:"alert  alert-success"
                                });
                            }else if(user.role =="Artist"){
                                res.render('./artist/artist-dashboard',{
                                    user:user,
                                    msg:"Successfully changed your password",
                                    alert:"alert  alert-success"
                                });
                            }else if(user.role =="Supplier"){
                                res.render('./supplier/supplier-dashboard',{
                                    user:user,
                                    msg:"Successfully changed your password",
                                    alert:"alert  alert-success"
                                });
                            }else{
                                res.render('./customer/customer-dashboard',{
                                    user:user,
                                    msg:"Successfully changed your password",
                                    alert:"alert  alert-success"
                                });
                            }
                          });
                        });
                      });
                    }else{
                      const msg ="Current Passwords do not match";
                      res.json(msg);
                      /*res.render('./admin/admin-dashboard',{
                        alert:"danger",
                        layout:layout,
                        msg:msg
                      });*/
                    }
                  });
            }else{
                return res.status(422).json("Error changing password");
            }
        });
    }
});

//Log user in
router.post('/sign-in', passport.authenticate('local',{ failureRedirect: '/auth/sign-in' }),
   (req, res)=>{
     if(req.user.role =="Admin"){
         res.redirect('/admin/admin-dashboard');
     }else if(req.user.role =="Artist"){
         if(req.user.active == false){
            res.redirect('/auth/artist-verify-account');
         }else{
            res.redirect('/artist/artist-dashboard');
        }
     }else if(req.user.role == "Supplier"){
        if(req.user.active == false){
            res.redirect('/auth/user-verify-account');
         }else{
            res.redirect('/supplier/supplier-dashboard');
        }
     }else{
        if(req.user.active == false){
            res.redirect('/auth/user-verify-account');
         }else{
            res.redirect('/customer/customer-dashboard');
        }
     }
  }
);

//sign-out 
router.get('/sign-out', ensureAuthentication, (req,res)=>{
    req.logout();
    res.redirect('/');
});

//check authentication
function ensureAuthentication(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/');
    }
}

module.exports = router;