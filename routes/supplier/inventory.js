const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
//models
const Product= require('../../model/inventory/product');
const DressedBy= require('../../model/inventory/dressedby');
const Category= require('../../model/inventory/category');


//get products
router.get('/supplier-view-products',ensureAuthentication,(req,res)=>{
    Product.find({},(err,products)=>{
        if(err) throw err;
        res.render('./supplier/view-products',{
            products:products,
            layout:"./layouts/supplierLayout.handlebars",
        }) 
    });
});
//supplier adding product 21  10 oclock
router.post('/supplier-add-product',ensureAuthentication,(req, res)=>{
    
    const newProduct = new Product({

        product_id : req.body.productid,
        product_name : req.body.productname.toLowerCase(),
        product_price: req.body.productprice,
        product_description : req.body.productdescription,
        product_category: req.body.category,
        product_color : req.body.productcolor,
        product_size : req.body.productsize,
        product_quantity : req.body.productquantity,
        product_tag : req.body.producttag,
        uploadDate : new Date(Date.now()).toISOString(),
    });
    const errors = validationResult(req);
    Product.findOne({product_name : req.body.productname.toLowerCase()},(err,product)=>{
        if(err) throw err;
        if(!product){
            Product.createProduct(newProduct,(err)=>{
                if (err) throw err;
                const alert = "alert alert-success";
                const msg = "Successfully added";
                Product.find({},(err,products)=>{
                    if(err) throw err;
                    res.render('./supplier/view-products',{
                        layout:"./layouts/supplierLayout.handlebars",
                        alert:alert,
                        msg: msg,
                        products:products
                    });
                });
            });
        }else{
            Product.find({},(err,products)=>{
                if(err) throw err;
                res.render('./supplier/view-products',{
                    layout:"./layouts/supplierLayout.handlebars",
                    alert:"alert alet-danger",
                    msg: "Product already exist",
                    products:products
                });
            });
        }
    });
});

//supplier adding product 21  10 oclock
router.post('/supplier-dressed-artist',ensureAuthentication,(req, res)=>{
    console.log(req.body.product_name);
    const newDressedBy = new DressedBy({

        product_id : req.body.product_name,
        artist_song : req.body.song,
        artist_name : req.body.artist,
        supplierId : req.user.id,
        uploadDate : new Date(Date.now()).toISOString(),
    });
    const errors = validationResult(req);
    DressedBy.findOne({$and:[{artist_song:req.body.song},{artist_name:req.body.artist}]},(err,data)=>{
        if(err) throw err;
        if(!data){  
            DressedBy.createDressedBy(newDressedBy,(err)=>{
                if (err) throw err;
                const alert = "alert alert-success";
                const msg = "Successfully added";
                res.render('./supplier/supplier-dashboard',{
                    layout:"./layouts/supplierLayout.handlebars",
                    alert:alert,
                    msg: msg
                });
            });
        }else{
            
            DressedBy.createDressedBy(newDressedBy,(err)=>{
                if (err) throw err;
                const alert = "alert alert-danger";
                const msg = "Ummm iwe wakaisa kare that data";
                res.render('./supplier/supplier-dashboard',{
                    layout:"./layouts/supplierLayout.handlebars",
                    alert:alert,
                    msg: msg
                });
            });
        }
    });
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