const express = require('express');
const router = express.Router();
//models
const User= require('../../model/user');


  
   router.post('/search',(req, res)=>{
        var q =  req.body.search;
        
        //({firstname:{$regex:/pa/i}}).
            //User.find({firstname:{$regex: new RegExp(q)}},(err, regex)=>{
               User.find({firstname:{$regex: new RegExp( escapeRegex(q), 'gi')}},(err, result)=>{
               
                //  res.redirect('/');
                //  res.render('./shared/search-page');
               if(err){ console.log(err);}
               else{
                  if(result.length<1){
                     var noMatch = "No artist name match that query, please try again."
                  }
                  
               res.render('./shared/search-page',{
                  user:result, noMatch: noMatch });
               }
              });
            });
         
            function escapeRegex(text) {
               return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
module.exports = router;   