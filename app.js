const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require ('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 3000;
//const LocalStrategy = require('passport-local').Strategy;
const config = require('./config/database');
const socketIO = require('./config/io');
const mongoose = require('mongoose');
//Db connections
mongoose.connect(config.database, { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
//Check db connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function(err){
  console.log(err);
});

//All Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
//Admin
const admin = require('./routes/admin/admin');
const manage_artist = require('./routes/admin/artist_management');
const manage_supplier = require('./routes/admin/supplier_management');
const manage_customers = require('./routes/admin/customer_management');
//Artist
const artist = require('./routes/artist/artist');
//Supplier
const supplier = require('./routes/supplier/supplier');
const inventory = require('./routes/supplier/inventory');
//Customer
const customer = require('./routes/customer/customer');
//Shared
const shared = require('./routes/shared/shared');
///shop
const shop = require('./routes/shared/shop');

//Initializing App
const app = express();

//View engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({
  defaultLayout:'layout',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

//app.use(enforceSSL);


//Express session
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  saveUnitialized: true,
  resave: true
}));

//Passport Initializing
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(express.json());

//Connect Flash
app.use(flash());

//Global constiables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();

});

//Get routes files
app.use('/', index);
app.use('/auth', auth);

//Under admin
app.use('/admin', admin);
app.use('/admin', manage_artist);
app.use('/admin', manage_customers);
app.use('/admin', manage_supplier);

//Under supplier
app.use('/supplier', supplier);
app.use('/supplier', inventory);
//Under artist
app.use('/artist', artist);
//Under customer
app.use('/customer', customer);
//Under shared
app.use('/shared', shared);
app.use('/shop', shop);

//Set port and Start App
let httpServer = http.createServer(app);
httpServer.listen(port);
//app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Server started on port '+port);
});

// SETUP SOCKET BROADCASTS
socketIO(httpServer)
