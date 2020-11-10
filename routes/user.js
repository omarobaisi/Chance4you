var express    = require('express');
var User       = require('../models/user');
var Order       = require('../models/order');
var Cart       = require('../models/cart');
var passport   = require("passport");
var middleware = require("../middleware");
var router     = express.Router();

// Password reset
var async      = require("async");
    nodemailer = require("nodemailer");
    crypto     = require("crypto");

// Profile
router.get('/profile', middleware.isLoggedIn, function(req, res) {
  Order.find({user: req.user}, function(err, orders) {
    if(err) {
      console.log(err);
    }
      var cart;
      orders.forEach(function(order) {
        cart        = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render("user/profile", {orders: orders});
  });
});

// Register
router.get('/register', function(req, res) {
    res.render('user/register');
});

router.post('/register', function(req ,res) {
    var newUser = new User({email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname, phone: req.body.phone, city: req.body.city, address: req.body.address});
    if(req.body.adminCode === "admincode"){
        newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render('User/register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "تم التسجيل بنجاح");
            res.redirect("/user/profile");
        });
    });
});

// Login
router.get('/login', function(req, res) {
    res.render('user/login');
});



router.post("/login", passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash   : true
  }),function(req, res) {
    console.log(req.session.oldurl);
    if(req.body.url) {
      console.log(req.url);
      var oldurl             = req.session.oldurl
          req.session.oldurl = null;
      req.flash("success", "تم تسجيل الدخول بنجاح");
      res.redirect('/shop/checkout');
    } else if(req.user.isAdmin == true) {
      console.log(req.url);
      req.flash("success", "تم تسجيل الدخول بنجاح");
      res.redirect("/order");
    } else {
      console.log(req.url);
      req.flash("success", "تم تسجيل الدخول بنجاح");
      res.redirect("/user/profile");
    }
});

// Logout
router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash("success", "تم تسجيل الخروج بنجاح");
    res.redirect("/product");
});

// Edit Profile
router.put("/profile/:id", middleware.isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            console.log("Successfully Edited Your profile!");
            req.flash("success", "Successfully Edited Your profile!");
            res.redirect("/user/profile");
        }
    });
});

// Forgot password
router.get('/forgot', function(req, res) {
    res.render('user/forgot');
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            // req.flash('error', 'لا يوجد حساب بهذا البريد الالكتروني');
            console.log(err);
            return res.redirect('/user/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.adminemail,
                pass: process.env.adminpassword
            }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.adminemail,
          subject: 'أعادة تعيين كلمة السر لحسابك',
          text: 'تم طلب تغيير كلمة سر حسابك\n\n' +
            ': من فضلك اضغط على الرابط التالي لاتمام العملية\n\n' +
            'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
            'اذا لم تقم بطلب تغيير كلمة السر تجاهل هذه الرسالة وستبقى كلمة السر كما كانت\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'بالمزيد من المعلومات ' + user.email + ' تم ارسال رسالة الى البريد الالكتروني ل');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/user/forgot');
    });
});

// Reset  password
router.get("/reset/:token", function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'رابط اعادة تعيين كلمة السر غير صالح أو انتهت صلاحيته');
            return res.redirect('/user/forgot');
        }
        res.render('user/reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'رابط اعادة تعيين كلمة السر غير صالح أو انتهت صلاحيته');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "كلمات السر غير متشابهة");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.adminemail,
            pass: process.env.adminpassword
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.adminemail,
          subject: 'تم اعادة تعيين كلمة سر حسابك',
          text: 'مرحبا,\n\n' +
            'قد تم تغييرها ' + user.email + ' هذه الرسالة للتاكيد بان كلمة السر لصاحب حساب\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'تم تغيير كلمة السر بنجاح');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/product');
    });
});

module.exports = router;