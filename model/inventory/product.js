const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const ProductSchema = mongoose.Schema({
    product_id:{
        type:String
      },
    product_name:{
        type:String
    },
    product_price:{
        type:String
    },
    product_description:{
        type:String
    },
    product_category:{
        type:String
    },
    product_color:[{
        type:String
    }],
    product_size:{
        type:String
    },
    product_quantity:{
        type:Number
    },
    product_tag:{
        type:String
    },
    product_image: { 
        //data: Buffer, 
        type: String
     },
    uploadDate:{
        type: Date,
    },
    supplierId:{
        type:String
    },
    
}, { timestamps: true });

const Product = module.exports = mongoose.model('Product', ProductSchema);
//Create new user
module.exports.createProduct = (newProduct, callback)=>{
    newProduct.save(callback);
  
}