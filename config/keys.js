require('dotenv').config();
module.exports ={
    google:{
      clientID:process.env.GOOGLE_CLIENTID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET
    },
    facebook:{
      clientID:process.env.FACEBOOK_CLIENTID,
      clientSecret:process.env.FACEBOOK_CLIENT_SECRET
    },
    nexmo:{
      apiKey: process.env.NEXMO_KEY,
      apiSecret: process.env.NEXMO_SECRETE
    },
    mail:{
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  }
