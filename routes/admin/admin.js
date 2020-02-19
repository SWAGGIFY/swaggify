const express = require('express');
const router = express.Router();
//models
const User= require('../../model/user');

router.get('/admin-dashboard', ensureAuthentication, function(req, res){
    //res.send(req.user)
   res.render('./admin/admin-dashboard',{
       //user:req.user,
       layout:"../layouts/authenticated.handlebars"
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