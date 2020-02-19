const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require ('passport');
const router = express.Router();
//models
const User= require('../../model/user');

//get User Creation router
router.post('/admin-add-user',ensureAuthendication,(req, res)=>{
    
    const newUSer = new User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        username : req.body.username,
        role: req.body.role,
        password : req.body.pwd,
        socialNetwork : [{
            email:req.body.email.toLowerCase(),
        }]
    });
    const errors = validationResult(req);

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
});

// update function
router.put('/profileupdate', function(req, res) {
    console.log('Updating user profile');
    User.findByIdAndUpdate(req.params.id, {
      $set: {firstname:req.body.firstname,lastname:req.body.lastname}
    },
    {
    new: true
    },
    function(err, User){
        if(err){
            //req.session.loggedIn = true;
            res.send("Error updating video")
        }else{
            res.json(User);
        }
    }
    );
  });
  
  //check authentication
function ensureAuthentication(req, res, next){
    if(req.isAuthenticated){
        return next();
    }else{
        res.redirect('/');
    }
}

  module.exports = router;
