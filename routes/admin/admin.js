const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
//models
const User= require('../../model/user');
const Package= require('../../model/package');
const Category= require('../../model/inventory/category');
const Auction = require('../../model/auction/auction');

router.get('/admin-dashboard', ensureAuthentication, function(req, res){
    //res.send(req.user)
   res.render('./admin/admin-dashboard',{
       //user:req.user,
       layout:"../layouts/authenticated.handlebars"
   });
});

//Packages
router.post('/admin-add-package', ensureAuthentication, function(req, res){
  Package.find({},(err,packages)=>{
    if(err) throw err;
    Package.findOne({pname:req.body.pname.toUpperCase()},(err, package)=>{
      if (err) throw err;
      if(package){
        res.render('./shared/pricing',{
          alert:"alert alert-danger",
          msg:"Package already exists",
          layout:"../layouts/authenticated.handlebars",
          packages:packages
        });
      }else{
        const newPackage =new Package({
          pname:req.body.pname.toUpperCase(),
          package_description:req.body.package_description,
          package_price:req.body.package_price,
          packages:packages
        });
        Package.createPackage(newPackage,()=>{
          res.render('./shared/pricing',{
            alert:"alert alert-success",
            msg:"Package successfully added",
            layout:"../layouts/authenticated.handlebars",
            packages:packages
          });
        });
      }
    });
  });
});

//Packages end

// create category router
router.post('/admin-add-category',ensureAuthentication,(req, res)=>{
    
  const newCategory = new Category({
      category_name : req.body.categoryname.toUpperCase(),
      category_description : req.body.categorydecription,
  });
  const errors = validationResult(req);
  Category.findOne({category_name:req.body.categoryname.toUpperCase()},(err, category)=>{
    if(err) throw err;
    Category.find({},(err,categories)=>{
      if(err) throw err;
      if(!category){
        Category.createCategory(newCategory,(err)=>{
          if (err) throw err;
          const alert = "alert alert-success";
          const msg = "Successfully added";
          res.render('./admin/view-category',{
            layout:"../layouts/authenticated.handlebars",
            alert:alert,
            msg: msg,
            categories:categories
          });
       });
      }else{
        res.render('./admin/view-category',{
          layout:"../layouts/authenticated.handlebars",
          alert:"alert alert-danger",
          msg: "Category already added",
          categories:categories,
        });
      }
    });
  });
});

//admin view category
router.get('/admin-view-category', ensureAuthentication, function(req, res){
  //res.send(req.user)
  Category.find({},(err, categories)=>{
    //var user = [users];
    if(err) throw err;
      //res.send(users);
    res.render('./admin/view-category',{
      categories:categories,
      layout:"../layouts/authenticated.handlebars"
    });
  });
});

//get User Creation router
router.post('/admin-add-user',ensureAuthentication,(req, res)=>{
    
  const newUSer = new User({
      role: req.body.role,
      active : false,
      socialNetwork : [{
          email:req.body.email.toLowerCase(),
      }]
  });
  const errors = validationResult(req);
  User.findOne({socialNetwork:{$elemMatch:{email:req.body.email.toLowerCase()}}},(err, user)=>{
    if(err) throw err;
    User.find({active:true},(err, users)=>{
        if(err) throw err;
      if(!user){
        console.log(req.body.email);
        User.createUser(newUSer,(err)=>{
            if (err) throw err;
            const alert = "alert alert-success";
            const msg = "Successfully added";
            res.render('./admin/view-users',{
                alert:alert,
                msg: msg,
                users:users,
                layout:"../layouts/authenticated.handlebars"
            });
        });
      }else{
        res.render('./admin/view-users',{
          alert:"alert alert-danger",
          msg: "User already added",
          users:users,
          layout:"../layouts/authenticated.handlebars"
      });
      }
    });
  })
});


router.get('/admin-view-users', ensureAuthentication, function(req, res){
  //res.send(req.user)
  User.find({$and:[{active:true},{role:{$ne:"Admin"}}]},(err, users)=>{
    //var user = [users];
    if(err) throw err;
      //res.send(users);
    res.render('./admin/view-users',{
      users:users,
      layout:"../layouts/authenticated.handlebars"
    });
  });
});

router.post('/admin-add-auction',ensureAuthentication,(req,res)=>{
  var newAuction = new Auction({
    // set auction info
    name : req.body.name,
    startDate : req.body.startDate,
    endDate : req.body.endDate,
    description : req.body.description,
    startAmount : req.body.startAmount,
    enabled : req.body.enabled,
    countdown : req.body.countdown,
  });

  Auction.createAuction(newAuction,(err)=>{
    if (err) throw err;
    Auction.find({},(err,auctions)=>{
      if(err) throw err;
      res.render('./auction/view-auctions',{
        alert:"alert alert-success",
        msg:"Auction successfully added",
        layout:'../layouts/authenticated.handlebars',
        auctions:auctions
      });
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