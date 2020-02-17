const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require ('passport');
const router = express.Router();
//models
const User= require('../model/user');

///get signin 
router.get('/sign-in',(req,res)=>{
    res.render('./homefiles/sign-in')
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
    
    const newUSer = new User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        password : req.body.pwd,
        socialNetwork : [{
            email:req.body.email.toLowerCase(),
        }]
    });
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
});

//Log user in
router.post('/sign-in', passport.authenticate('local',{ failureRedirect: '/auth/sign-in' }),
   (req, res)=>{
     if(req.user.role =="Admin"){
         res.redirect('/admin/admin-dashboard');
     }else if(req.user.role =="Artist"){
        res.redirect('/artist/artist-dashboard');
     }else if(req.user.role == "Supplier"){
        res.redirect('/supplier/supplier-dashboard');
     }else{
        res.redirect('/customer/customer-dashboard');
     }
  }
);

module.exports = router;