const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const DressedBySchema = mongoose.Schema({
    product_id:{
        type:String
      },
    uploadDate:{
        type: Date,
    },
    supplierId:{
        type:String
    },
    artist_song:{
        type:String
    },
    artist_name:{
        type:String
    }
    
});

const DressedBy = module.exports = mongoose.model('DressBy', DressedBySchema);
//Create new user
module.exports.createDressedBy = (newDressBy, callback)=>{
    newDressBy.save(callback);
  
}