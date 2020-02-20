const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
//models
const User= require('../../model/user');
const Request= require('../../model/request');

//Ajax data handler
router.get('/object-data',ensureAuthentication,(req,res)=>{
    console.log(req.query.data_type);
    var id = req.query.id.slice(0,24);
    if(req.query.data_type =="user"){
        console.log("user");
        User.findOne({_id:id},(err, user)=>{
            if(err) throw err;
            res.json(user);
        });
    }else if(req.query.data_type =="request"){
        Request.findOne({_id:id},(err, requests)=>{
            if(err) throw err;
            res.json(requests);
        })
    }else{

    }
})

///Delete handle
router.get('/delete-data', ensureAuthentication,(req,res)=>{
    if(req.query.id ==req.user.id && req.user.role =="Admin"){
        res.json('Iwe ukuputa dzemari, ukuda kuzvibvisa musystem uriwe admin');
    }else{
        if(req.query.data_type =="user"){
            User.findOneAndDelete({_id:req.query.id},(err)=>{
                    if (err) throw err;
                    res.json("Successfully deleted");
            });
        }else if(req.query.data_type =="request"){
            Request.findOneAndDelete({_id:req.query.id},(err)=>{
                if (err) throw err;
                res.json("Successfully deleted");
        });
        }else{

        }
    }
});


// update function
router.put('/profileupdate', (req, res)=>{
    console.log('Updating user profile');
    User.findByIdAndUpdate(req.params.id, {
      $set: {firstname:req.body.firstname,lastname:req.body.lastname}
    },
    {
    new: true
    },
    (err, User)=>{
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
