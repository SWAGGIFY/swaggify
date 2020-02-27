const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const CategorySchema = mongoose.Schema({
    category_name:{
        type:String
    },
    category_description:{
        type:String
    },
}, { timestamps: true });

const Category = module.exports = mongoose.model('Category', CategorySchema);
//Create new user
module.exports.createCategory = (newCategory, callback)=>{
    newCategory.save(callback);
  
}