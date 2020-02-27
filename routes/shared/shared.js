const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const fs = require('fs');
//models
const User= require('../../model/user');
const Request= require('../../model/request');
const Song= require('../../model/song');
const Product = require('../../model/inventory/product');
const Category = require('../../model/inventory/category');
const Auction = require('../../model/auction/auction');


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
    }else if(req.query.data_type =="song"){
        Song.findOne({_id:id},(err, song)=>{
            if(err) throw err;
            res.json(song);
        })
    }else{

    }
});

router.get('/category-data', (req,res)=>{
    Category.find({},(err, categories)=>{
        if(err) throw err;
        res.json(categories);
    });
});

router.get('/artist-data', (req,res)=>{
    User.find({$and:[{role:"Artist" },{active:true}]},(err, artists)=>{
        if(err) throw err;
        res.json(artists);
    });
});

router.get('/product-data', (req,res)=>{
    
    Product.find({},(err, products)=>{
        if(err) throw err;
        res.json(products);
    });
});

router.get('/artist-songs', (req,res)=>{
    console.log(req.query.id)
    Song.find({artist_id:req.query.id},(err, songs)=>{
        if(err) throw err;
        console.log(songs)
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
        }else if(req.query.data_type =="song"){
            Song.findOneAndDelete({_id:req.query.id},(err)=>{
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

  router.get('/buy-item',(req,res)=>{
      if(!req.isAuthenticated()){
          res.render('./homefiles/sign-in',{
              msg:"Option only available to Swaggnation! Please sign-up.",
              alert: "alert alert-danger"
          });
      }else{
          res.send("Continue purchasing either eccocash or whatever")
      }
  });

  router.get('/view-auctions',async(req,res)=>{
    const fields = 'name description startDate endDate startAmount currentBid countdown _id';
    const filter = {
      enabled: true
    };
  
    try {
      const auctions = await Auction
        .find(filter, null, { sort: 'startDate' })
        .select(fields)
       if(req.isAuthenticated()){
           if(req.user.role=="Admin"){
            res.render('./auction/view-auctions',{
                auctions:auctions,
                layout :'../layouts/authenticated.handlebars'
            });
           }else if(req.user.role=="Supplier"){
            res.render('./auction/view-auctions',{
                auctions:auctions,
                layout :'../layouts/supplierLayout.handlebars'
            });
           }else if(req.user.role=="Artist"){
            res.render('./auction/view-auctions',{
                auctions:auctions,
                layout :'../layouts/artist.handlebars'
            });
           }else{
            res.render('./auction/view-auctions',{
                auctions:auctions,
                layout :'../layouts/customerLayout.handlebars'
            });
        }
       }
    } catch (err) {
      res.send(err)
    }
  });

  router.get('/view-auction',async(req,res)=>{
    const id = req.params.auction_id
    const fields = 'name description startDate endDate startAmount currentBid countdown _id';

    try {
        const auction = await Auction
        .findById(id, fields)

        res.json(auction);
    } catch (err) {
        res.send(err)
    }
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
