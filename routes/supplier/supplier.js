const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
//models
const Product= require('../../model/inventory/product');

router.get('/supplier-dashboard', ensureAuthentication, (req, res) =>{
    
    res.render('./supplier/supplier-dashboard',{
        layout:"../layouts/supplierLayout.handlebars"
    });
});

//supplier adding product 21  10 oclock
router.post('/add',ensureAuthentication,(req, res)=>{
    
    const newProduct = new Product({

        product_id : req.body.productid,
        product_name : req.body.productname,
        product_price: req.body.productprice,
        product_description : req.body.productdescription,
        product_category: req.body.productcategory,
        product_color : req.body.productcolor,
        product_size : req.body.productsize,
        product_quantity : req.body.productquantity,
        product_tag : req.body.producttag,
        artist_song : req.body.artistsong,
        artist_name : req.body.artistname,
        uploadDate : new Date(Date.now()).toISOString(),
    });
    const errors = validationResult(req);
    
        Product.createRequest(newProduct,(err)=>{
            if (err) throw err;
            const alert = "alert alert-success";
            const msg = "Successfully added";
            res.render('./supplier-dashboard',{
                layout:"../layouts/supplierLayout.handlebars",
                alert:alert,
                msg: msg
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