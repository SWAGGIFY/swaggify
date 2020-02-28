const express = require('express');
const router = express.Router();
//models
//const User= require('../../models/user');
const Auction= require('../model/auction/auction');

router.get('/',(req, res)=>{
   Auction.find({},(err, auctions)=>{
      res.render('./homefiles/index',{
         auctions:auctions
      });
   });
});

module.exports = router;