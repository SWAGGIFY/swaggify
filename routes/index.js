const express = require('express');
const router = express.Router();
//models
//const User= require('../../models/user');

router.get('/',(req, res)=>{
   res.render('./homefiles/index');
});

module.exports = router;