const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
//models
const User= require('../../model/user');

router.get('/admin-dashboard', ensureAuthentication, function(req, res){
    //res.send(req.user)
   res.render('./admin/admin-dashboard',{
       //user:req.user,
       layout:"../layouts/authenticated.handlebars"
   });
});

//get User Creation router
router.post('/admin-add-user',ensureAuthentication,(req, res)=>{
    
  const newUSer = new User({
      role: req.body.role,
      status : true,
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


router.get('/admin-view-users', ensureAuthentication, function(req, res){
  //res.send(req.user)
  User.find({},(err, users)=>{
    //var user = [users];
    if(err) throw err;
      //res.send(users);
    res.render('./admin/view-users',{
      users:users,
      layout:"../layouts/authenticated.handlebars"
    });
  });
});


//Ensure the user is authentecated
function ensureAuthentication(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else{
      res.redirect('/');
    }
  }

module.exports = router;