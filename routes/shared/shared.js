const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
//models
const User= require('../../model/user');
const Request= require('../../model/request');
const Product = require('../../model/inventory/product');
const Category = require('../../model/inventory/category');

//Ajax data handler
router.get('/object-data',ensureAuthentication,(req,res)=>{
    var id = req.query.id.slice(0,24);
    if(req.query.data_type =="user"){
        User.findOne({_id:id},(err, user)=>{
            if(err) throw err;
            res.json(user);
        });
    }else if(req.query.data_type =="request"){
        Request.findOne({_id:id},(err, request)=>{
            if(err) throw err;
            res.json(request);
        });
    }else if(req.query.data_type =="product"){
        Product.findOne({_id:id},(err, product)=>{
            if(err) throw err;
            res.json(product);
        });
    }else if(req.query.data_type =="category"){
        Category.findOne({_id:id},(err, category)=>{
            if(err) throw err;
            res.json(category);
        })
    }else{

    }
});

router.get('/category-data', (req,res)=>{
    console.log("running");
    Category.find({},(err, categories)=>{
        if(err) throw err;
        res.json(categories);
    });
});

router.get('/artist-data', (req,res)=>{
    console.log("running");
    User.find({role:"Artist"},(err, artists)=>{
        if(err) throw err;
        res.json(artists);
    });
});

router.get('/product-data', (req,res)=>{
    console.log("running");
    Product.find({},(err, products)=>{
        if(err) throw err;
        res.json(products);
    });
});

router.get('/song-data', (req,res)=>{
    console.log("running");
    Song.find({},(err, songs)=>{
        if(err) throw err;
        res.json(songs);
    });
});

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
        }else if(req.query.data_type =="product"){
            Product.findOneAndDelete({_id:req.query.id},(err)=>{
                if (err) throw err;
                res.json("Successfully deleted");
            });
        }else if(req.query.data_type =="category"){
            Category.findOneAndDelete({_id:req.query.id},(err)=>{
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
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/');
    }
}

  module.exports = router;
