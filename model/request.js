const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const RequestSchema = mongoose.Schema({
    order_id:{
        type:String
      },
    date:{
    type:date
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
});

const Request = module.exports = mongoose.model('Request', RequestSchema);
//Create new user
module.exports.createRequest = (newRequest, callback)=>{
    newRequest.save(callback);
  
}