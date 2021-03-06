const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const SocialNetworkSchema = mongoose.Schema({
    googleId:{
        type:String
      },
      facebookId:{
        type:String
      },
      facebook:{
        type: String,
        //unique: true,
        trim: true
      
      },
      twitter:{
        type: String,
        //unique: true,
        trim: true
      
      },
      instagram:{
        type: String,
        //unique: true,
        trim: true
      
      },
      email:{
        type: String,
        //unique: true,
        trim: true
      
      },
});

const AddressSchema = mongoose.Schema({
    address:{
        type:String
      },
    contact:{
      type:String
    },
    altcontact:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
});

const CompanySchema = mongoose.Schema({
    company_name:{
        type:String
      },
    address:{
      type:String
    },  
    tel:{
        type:String
    },
    category:{
      type:String
    },
    employees:{
      type:String
    },
    mobile:{
        type:String
    },
    postalcode:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
    description:{
        type:String
    },
    email:{
      type:String
    },
    inventory:{
      type:String
    },
    store:{
      type:String
    },
    payments:[{
      paypal:String,
      paynow: String,
      etf : String,
      Online_banking : String,
      other : String
    }]
});

//User Schema
const UserSchema = mongoose.Schema({
  
    firstname:{
      type: String,
  
    },
    lastname:{
      type: String,
  
    },
    username:{
      type: String,
      //unique: true,
      //trim: true
  
    },
    address:[
        AddressSchema
    ],
    socialNetwork:[
      SocialNetworkSchema
    ],
    role:{
      type:String,
  
    },
    package:{
      type:String,
  
    },
    active:{
      type: Boolean
    },
    password:{
      type: String,
    },
    avatar: {
  
        type: String
    },
    created_at:{
      type: Date,
    },
    update_at:{
      type: Date,
    },
    company:[
      CompanySchema
    ],
    blocked: { 
      type: Boolean, 
      default: true 
    }
  }, { timestamps: true });
  
const User = module.exports = mongoose.model('User', UserSchema);
//Create new user
module.exports.createUser = (newUser, callback)=>{
bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(newUser.password, salt, (err, hash)=>{
    newUser.password = hash;
    newUser.save(callback);
    });
});
}

//Get username
module.exports.getUserByUsername =  (username, callback)=>{
const query = {$or:[{username : username}, {socialNetwork:{$elemMatch:{email:username}}}] };
User.findOne(query, callback);

}

//Get userId
module.exports.getUserById = function (id, callback) {
User.findById(id, callback);
}

//Get password and compare
module.exports.comparePassword = function (password, hash, callback) {
bcrypt.compare(password, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
});
}