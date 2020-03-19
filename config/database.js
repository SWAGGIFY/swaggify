require('dotenv').config();
module.exports ={
    database:process.env.MONGOLAB_URI || `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
    secret: 'mysecret'
  }