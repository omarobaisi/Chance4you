var express               = require('express');
var cookieParser          = require('cookie-parser');
var bodyParser            = require('body-parser');              // Post
var mongoose              = require("mongoose");                 // DataBase
var methodOverride        = require("method-override");          // Override
var passport              = require("passport");                 // Authentication
var LocalStrategy         = require("passport-local");           // Authentication
var passportLocalMongoose = require("passport-local-mongoose");  // Authenticatio
var flash                 = require("connect-flash");            // Flash messages
var session               = require('express-session');
var mongoStore            = require('connect-mongo')(session);
var inlineCss             = require('nodemailer-juice');         // Email styling
                            require('dotenv').config();    			 // Environment Variables
var app = express();

// DataBase
var Product = require("./models/product");
var User    = require("./models/user");

var indexRoutes   = require('./routes/index');
var productRoutes = require('./routes/product');
var userRoutes    = require('./routes/user');
var shopRoutes    = require('./routes/shop');
var orderRoutes   = require('./routes/order');

app.use(cookieParser());
app.set('view engine', 'ejs');     // For ejs
app.use(express.static('public'));     // Use CSS in public folder
app.use(bodyParser.urlencoded({extended: true}));     // Post
app.use(methodOverride("_method"));     // Override
app.use(flash());  // Flash messages
app.locals.moment = require('moment');  // Time since created
app.use(require("express-session")({
  secret           : "Anything",
  resave           : false,
  saveUninitialized: false,
  store            : new mongoStore({mongooseConnection: mongoose.connection}),
  cookie           : {maxAge: 180 * 6 * 1000}
}));

// DataBase
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var url = process.env.DATABASEURL;
mongoose.connect(url, {useNewUrlParser: true})
.then(() => console.log("connected to the DB!"))
.catch(error => console.log(error.message));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({usernameField: 'email',},User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  res.locals.session     = req.session;
	next();
});

app.use('/', indexRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/shop', shopRoutes);
app.use('/order', orderRoutes);


/* ---------- */

// Page not found
app.get('*', function(req, res){
    res.send('Page Not Found');
});

// Start a host
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server Has Started!');
});