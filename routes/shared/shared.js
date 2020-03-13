const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const fs = require('fs');
//models
const User= require('../../model/user');
const Package= require('../../model/package');
const Request= require('../../model/request');
const Song= require('../../model/song');
const Product = require('../../model/inventory/product');
const DressedBy = require('../../model/inventory/dressedby');
const Category = require('../../model/inventory/category');
const Auction = require('../../model/auction/auction');


router.get('/object-data-shop',(req,res)=>{
    Product.find({},(err, product)=>{
        if(err) throw err;
        res.json(product);
    });

});
//Ajax data handler
router.get('/object-data'/*,ensureAuthentication*/,(req,res)=>{
var id = req.query.id.slice(0,24);
if(id == "undefined"){
}else{
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
    }else if(req.query.data_type =="songProducts"){
        DressedBy.findOne({artist_song:id},(err, song)=>{
            if(err) throw err;
            res.json(song);
        })
    }else{

    }
}
});


router.get('/auctions',async(req,res)=>{
    const fields = 'name description startDate endDate startAmount currentBid countdown _id';
    const filter = {
      enabled: true
    };
  
    try {
      const auctions = await Auction
        .find(filter, null, { sort: 'startDate' })
        .select(fields);
        res.json(auctions);
    } catch (err) {
      res.send(err)
    }
});

router.get('/view-packages', ensureAuthentication, function(req, res){
    //res.send(req.user)
    Package.find({},(err,packages)=>{
        if(err) throw err;
        if(req.user.role =="Admin"){
            res.render('./admin/admin-view-packages',{
                packagies:packages,
                layout:"./layouts/authenticated.handlebars"
            });
        }else if(req.user.role =="Supplier"){
            res.render('./shared/pricing',{
                packages:packages,
                layout:"../layouts/supplierLayout.handlebars"
            });
        }else if(req.user.role =="Artist"){
            res.render('./shared/pricing',{
                packages:packages,
                layout:"../layouts/artistLayout.handlebars"
            });
        }else{
            res.render('./shared/pricing',{
                packages:packages,
                layout:"../layouts/customerLayout.handlebars"
            });
        }
    });
  });

//Category
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

router.get('/view-artist',ensureAuthentication, (req,res)=>{
    User.find({$and:[{role:"Artist" },{active:true}]},(err, artists)=>{
        if(err) throw err;
        if(req.user.role=="Admin"){
            res.render('./shared/view-artists',{
                artists:artists,
                layout :'../layouts/authenticated.handlebars'
            });
        }else if(req.user.role=="Supplier"){
            res.render('./shared/view-artists',{
                artists:artists,
                layout :'../layouts/supplierLayout.handlebars'
            });
        }else if(req.user.role=="Artist"){
            res.render('./shared/view-artists',{
                artists:artists,
                layout :'../layouts/artist.handlebars'
            });
        }else{
            res.render('./shared/view-artists',{
                artists:artists,
                layout :'../layouts/customerLayout.handlebars'
            });
        }
    });
});

router.get('/artist-details',ensureAuthentication, (req,res)=>{
    Song.find({artist_id:req.query.artist_id.slice(0,24)},(err, songs)=>{
        if(err) throw err;
        if(req.user.role=="Admin"){
            res.render('./shared/artist-details',{
                songs:songs,
                layout :'../layouts/authenticated.handlebars'
            });
        }else if(req.user.role=="Supplier"){
            res.render('./shared/artist-details',{
                songs:songs,
                layout :'../layouts/supplierLayout.handlebars'
            });
        }else if(req.user.role=="Artist"){
            res.render('./shared/artist-details',{
                songs:songs,
                layout :'../layouts/artist.handlebars'
            });
        }else{
            res.render('./shared/artist-details',{
                songs:songs,
                layout :'../layouts/customerLayout.handlebars'
            });
        }
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

  ///buying an item 
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

  ////check for the bidding user
 
  ///Create bid
  router.get('/bid-item',async(req,res)=>{
    const fields = 'name description startDate endDate startAmount currentBid countdown _id';
    const id = req.query.auction_id.slice(0,24);
    const filter = {
        enabled: true
      };
        try {
            const auctionDetail = await Auction
             .findById(id, fields);
             const auctions = await Auction
                .find(filter, null, { sort: 'startDate' })
                .select(fields);
            if(!req.isAuthenticated()){
                res.render('./homefiles/sign-in',{
                    msg:"Option only available to Swaggnation! Please sign-up.",
                    alert: "alert alert-danger",
                    layout:false,
                    auction_id:req.query.auction_id
                });
            }else{
                if(req.user.blocked == true){
                    return res.send({
                        success: false,
                        message: "You're currently not allowed to bit."
                    });
                }else{
                    if(req.user.package =="Bronze" ){
                        if(req.user.role=="Admin"){
                            res.render('./shared/pricing',{
                                alert:"alert alert-danger",
                                msg:"Please upgrade your package",
                                layout :'./layouts/authenticated.handlebars'
                            });
                           }else if(req.user.role=="Supplier"){
                                res.render('./shared/pricing',{
                                    alert:"alert alert-danger",
                                    msg:"Please upgrade your package",
                                    layout :'./layouts/supplierLayout.handlebars'
                                });
                           }else if(req.user.role=="Artist"){
                                res.render('./shared/pricing',{
                                    alert:"alert alert-danger",
                                    msg:"Please upgrade your package", 
                                    layout :'./layouts/artist.handlebars'
                                });
                           }else{
                                res.render('./shared/pricing',{
                                    alert:"alert alert-danger",
                                    msg:"Please upgrade your package",
                                    layout :'./layouts/customerLayout.handlebars'
                                });
                           }
                    }else{
                        try {
                            const auction = await Auction.findById(req.query.auction_id.slice(0,24), 'name description startDate endDate startAmount currentBid countdown _id bids autobids');
                        
                            const updatedAuction = await auction.addBid({
                                value: req.body.value,
                                userid: req.user._id,
                                name: req.user.name
                            });
                            //res.send(updatedAuction)
                            res.render('./auction/auction-details',{
                                success: false,
                                auctions:auctions,
                                auctionDetail:auctionDetail,
                                updatedAuction:updatedAuction

                            });
                            //res.json({ auction: updatedAuction, success: true });
                        } catch ({ message }) {
                        res.render('./auction/auction-details',{
                            success: false,
                            message,
                            auctionDetail:auctionDetail,
                            auctions:auctions,
                        });
                        }
                    }
                }
            }
        } catch (err) {
            res.send({
            success: false,
            message: err
            })
        }
        
    });

    //Create Autobid
    router.post('/auto-bid',ensureAuthentication, async(req,res)=>{
        // Check if it's an autobid
        if (req.body.autobid && req.body.value) {
            // Check the autobid userid/value don't already exist
            var autobidExists = auction.autobids.filter(function (obj) {
            return obj.value == req.body.value && obj.userid == req.user._id
            });

            if (autobidExists.length === 0) {
            // Save the autobid
            auction.autobids.push({
                value: req.body.value,
                userid: req.user._id,
                name: req.user.name
            });

            // Use the minimumBid value to create bid instead of the Users max bid (Autobid value)
            bid.value = minimumBid;
            msgResult = true;
            msg = 'Your Autobid for £' + req.body.value + ' has been accepted.';
            res.send(msg);
            } else {
            msgResult = false;
            msg = 'You have already Autobid this amount.';
            res.send(msg);
            }
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
        .select(fields);
       if(req.isAuthenticated()){
           if(req.user.role=="Admin"){
            res.render('./admin/admin-view-auctions',{
                auctions:auctions,
                layout :'./layouts/authenticated.handlebars'
            });
           }else{
                res.render('./auction/view-auctions',{
                    auctions:auctions,
                });
           }
        }else{
            res.render('./auction/view-auctions',{
                auctions:auctions,
                layout:"./layouts/layout2.handlebars"
            });
       }
    } catch (err) {
      res.send(err)
    }
  });

  router.get('/view-auction',async(req,res)=>{
    const id = req.query.auction_id.slice(0,24);
    const fields = 'name description startDate endDate startAmount currentBid countdown _id';
    const filter = {
      enabled: true
    };

    try {
        const auction = await Auction
        .findById(id, fields);
        const auctions = await Auction
        .find(filter, null, { sort: 'startDate' })
        .select(fields);
        if(req.isAuthenticated()){
            if(req.user.role == "Admin"){
                res.render('./auction/auction-details',{
                    layout:'../layouts/authenticated.handlebars',
                    auction:auction,
                    auctions:auctions
                });
            }else if(req.user.role == "Supplier"){
                res.render('./auction/action-details',{
                    layout:'../layouts/supplierLayout.handlebars',
                    auction:auction,
                    auctions:auctions
                });
            }else{
                res.render('./auction/auction-details',{
                    auction:auction,
                    auctions:auctions
                });
            }
        }else{
            res.render('./auction/auction-details',{
                auction:auction,
                auctions:auctions
            });
        }
    } catch (err) {
        res.send("Error iyo "+err);
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
