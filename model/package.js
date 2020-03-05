const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const PackageSchema = mongoose.Schema({
    pname:{
        type:String
      },
    package_price:{
        type:Number
    },
    ppackage_description:{
        type:String
    }
}, { timestamps: true });

const Package = module.exports = mongoose.model('Package', PackageSchema);
//Create new user
module.exports.createPackage = (newPackage, callback)=>{
    newPackage.save(callback);
  
}