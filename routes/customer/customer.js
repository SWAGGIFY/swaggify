const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const passport = require ('passport');
const Request= require('../../model/request');

router.get('/customer-dashboard', ensureAuthentication, (req, res) =>{
    
    res.render('./customer/customer-dashboard',{
        layout:"../layouts/customerLayout.handlebars"
    });
});

//customer Request
router.post('/customer-request',ensureAuthentication,(req, res)=>{
    
    const newRequest = new Request({

        order_quantity : req.body.order_quantity,
        date : new Date(Date.now()).toISOString(),
        product_name : req.body.productname,
        product_price: req.body.productprice,
        product_description : req.body.productdescription,
        customer_id: req.user.id
    });
    const errors = validationResult(req);
    
        Request.createRequest(newRequest,(err)=>{
            if (err) throw err;
            const alert = "alert alert-success";
            const msg = "Successfully added";
            res.render('./customer/customer-dashboard',{
                layout:"../layouts/customerLayout.handlebars",
                alert:alert,
                msg: msg
            });
        });
});

router.get('/customer-view-request',ensureAuthentication, (req, res)=>{
    //res.send(req.user)
    Request.find({},(err, request)=>{
      //var user = [users];
      if(err) throw err;
        //res.send(users);
      res.render('./customer/customer-view-request.handlebars',{
        request:request,
        layout:"../layouts/customerLayout.handlebars"
      });
    });
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