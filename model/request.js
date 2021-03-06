const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const RequestSchema = mongoose.Schema({
    order_quantity:{
        type:String
      },
    date:{
    type:Date
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
    customer_id:{
        type:String
    },
}, { timestamps: true });

const Request = module.exports = mongoose.model('Request', RequestSchema);
//Create new user
module.exports.createRequest = (newRequest, callback)=>{
    newRequest.save(callback);
  
}