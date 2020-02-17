const express = require('express');
const router = express.Router();
//models
const User= require('../../model/user');

router.get('/admin-dashboard', ensureAuthentication, function(req, res){
    //res.send(req.user)
   res.render('./admin/admin-dashboard',{
       //user:req.user,
       layout:"../layouts"
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