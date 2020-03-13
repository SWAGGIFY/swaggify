const express = require('express');
const router = express.Router();
//models
//const User= require('../../models/user');
const Auction= require('../model/auction/auction');

router.get('/index',(req, res)=>{
   Auction.find({},(err, auctions)=>{
      res.render('./homefiles/index',{
         auctions:auctions
      });
   });
});

router.get('/',(req, res)=>{
   Auction.find({},(err, auctions)=>{
      res.render('./homefiles/index2',{
         auctions:auctions,
         layout:"./layouts/layout2.handlebars"
      });
   });
});

module.exports = router;