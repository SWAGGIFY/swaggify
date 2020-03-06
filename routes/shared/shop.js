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
const DressedBy = require('../../model/inventory/dressedby');
const Cart = require('../../model/cart');

 // rounter view shop
 router.get('/shop', /*ensureAuthentication*/ function(req, res){
    Product.find({},(err, products)=>{
        
        //var user = [users];
        if(err) throw err;
          //res.send(users);
        res.render('./shop/shop',{
          products:products,
        });
      });
});

// view single product
router.get('/view-single-product/:id', /*ensureAuthentication*/ function(req, res){
    Product.find({_id:req.params.id.slice(0,24)},(err, product)=>{
        
        //var user = [users];
        if(err) throw err;
          //res.send(users);
        res.render('./shop/single-product',{
          product:product,
        });
      });
});

// add to cart
router.get("/add-to-cart", function(req, res, next) {
    var productId = req.query.product_id.slice(0,24)
    var cart = new Cart(req.session.cart ? req.session.cart : {})
  console.log(productId);
    Product.findById(productId, function(err, product) {
      if (err) {
        return res.redirect("/");
      }
      cart.add(product.product_name, product.id);
      req.session.cart = cart;
      console.log(product);
      console.log(cart);

      res.json(cart);
    });
  });

  // shopping cart
  router.get("/shopping-cart", function(req, res, next) {
    if (!req.session.cart) {
      return res.render("./shop/shopping-cart", {
        products: null
      })
    }
    var cart = new Cart(req.session.cart)
    res.render("./shop/shopping-cart", {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
    });
  });

  // reduce by one
  router.get("/reduce/:id", function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect("./shop/shopping-cart");
  });
  
// remove by one
  router.get("/remove/:id", function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect("./shop/shopping-cart");
  });
module.exports = router