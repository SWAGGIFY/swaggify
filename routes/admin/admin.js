const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
//models
const User= require('../../model/user');
const Category= require('../../model/inventory/category');

router.get('/admin-dashboard', ensureAuthentication, function(req, res){
    //res.send(req.user)
   res.render('./admin/admin-dashboard',{
       //user:req.user,
       layout:"../layouts/authenticated.handlebars"
   });
});

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