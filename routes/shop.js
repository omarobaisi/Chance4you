var express = require('express');
var Product = require('../models/product');
var Cart    = require('../models/cart');
var Order   = require('../models/order');
var middleware = require("../middleware");
const e = require('express');
var router  = express.Router();

// Add to cart
router.get('/add-to-cart/:id', function(req, res) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = cart.generateArray();
  var avalible = false;

  for(var i=0; i<product.length; i++) {
    if(product[i].item._id == req.params.id) {
      avalible = true;
      var qty = product[i].qty;
    }
  }

  Product.findById(req.params.id, function(err, found) {
    if(err) {
      console.log(err);
    } else if(avalible == true && found.instock <= qty) {
      req.flash("error", "لا يوجد كمية كافية بالمخزون");
      res.redirect('/product');
    } else {
      cart.add(found, found.id);
      req.session.cart = cart;
      res.redirect('/');
    }
  });
});

// Shopping cart
router.get('/shopping-cart', function(req, res){
    if(!req.session.cart) {
      return res.render('shop/cart', {product: null});
    }
      var cart = new Cart(req.session.cart);
      var product = cart.generateArray();
      res.render('shop/cart', {product: product, totalPrice: cart.totalPrice});
});

// Remove one item from cart
router.get('/reduce/:id', function(req, res) {
    var productId = req.params.id;
    var cart      = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shop/shopping-cart');
});

// Add one item to the cart
router.get('/add/:id', function(req, res) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = cart.generateArray();
  var avalible = false;

  for(var i=0; i<product.length; i++) {
    if(product[i].item._id == req.params.id) {
      avalible = true;
      var qty = product[i].qty;
    }
  }
  
  Product.findById(req.params.id, function(err, found) {
    if(err) {
      console.log(err);
    } else if(avalible == true && found.instock <= qty) {
      req.flash("error", "لا يوجد كمية كافية بالمخزون");
      res.redirect('/shop/shopping-cart');
    } else {
      cart.addOne(req.params.id);
      req.session.cart = cart;
      res.redirect('/shop/shopping-cart');
    }
  });
});

// Remove from cart
router.get('/remove/:id', function(req, res) {
    var productId = req.params.id;
    var cart      = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shop/shopping-cart');
});

// Checkout***
router.get('/checkout', function(req, res) {
  if(!req.session.cart) {
    return res.render('shop/cart', {product: null});
  }
    var cart = new Cart(req.session.cart);

    res.render('shop/checkout', {total: cart.totalPrice});

    // var product = cart.generateArray();
    // for(var i=0; i<product.length; i++) {
    //   var id = product[i].item._id;
    //   var qty = product[i].qty;
    //   console.log('k1 = '+i);
      
    //   Product.findById(id, i, function(err, found) {
    //     console.log('k2 = '+i);
    //     console.log('id = '+id);
    //     console.log('stock = '+found.instock + ", " + "qty = " + qty);
    //     console.log('name = '+found.name);
    //     if(err) {
    //       console.log(err);
    //     } else if(found.instock < qty) {
    //       req.flash("error", "احد المنتجات غير متوفر بالمخزون");
    //       res.redirect('/shop/shopping-cart');
    //     } else if(i == product.length) {
    //       res.render('shop/checkout', {total: cart.totalPrice});
    //     }
    //   });
    // }
});

// Email Templete
router.get('/email', middleware.checkAdmin, function(req, res) {
  res.render('shop/email');
})

// Registered Checkout
router.post('/usercheckout', function(req, res) {
  var cart = new Cart(req.session.cart);
  var product = cart.generateArray();
  var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth   : {
        user: process.env.adminemail,
        pass: process.env.adminpassword
    }
  });
  var mailOptions = {
    to     : process.env.chekcemail,
    from   : process.env.adminemail,
    subject: 'طلب جديد',
    html: '<h1 style="text-align: center;">طلب جديد</h1>'+
    '<h1 style="text-align: center;">'+req.body.name+" :الاسم المشتري  </h1>"+
    '<h1 style="text-align: center;">' + req.body.phone+" :رقم الهاتف </h1>"+
    '<h1 style="text-align: center;"> المدينة: ' + req.body.city+"</h1>"+
    '<h1 style="text-align: center;"> العنوان: ' + req.body.address+"</h1>"+
    '<h1 style="text-align: center;"> السعر الكلي: ' + cart.totalPrice+"₪"+"</h1>",
  };
  
  // smtpTransport.sendMail(mailOptions, function(err) {
  //   console.log('mail sent');
  // });

  // var mailOptions = {
  //   to     : req.body.email,
  //   from   : process.env.adminemail,
  //   subject: 'hhh',
  //   text   : 'hhh',
  // };
  
  smtpTransport.sendMail(mailOptions, function(err) {
    if(err) {
      req.flash('error', err.message);
      res.redirect('/shop/checkout')
    } else {

      var cart = new Cart(req.session.cart);
      
      var order = new Order({
        user     : req.user,
        cart     : cart,
        city     : req.body.city,
        address  : req.body.address,
        email    : req.body.email,
        phone    : req.body.phone,
        name     : req.body.name,
        paymentId: req.params.id
      });
      console.log('mail sent');

      cart        = new Cart(order.cart);
      order.items = cart.generateArray();

      // Stock
      order.items.forEach(function(item) {
        var id = item.item._id
        var qty = item.qty;
        Product.findById(id, function(err, found) {
          if(err) {
              console.log(err);
          } else {
            found.instock = found.instock - item.qty;
            if(found.instock === 0) {
              found.visible = 'غير متوفر';
            }
            found.save();
          }
        });
      });

    // var product = cart.generateArray()
    // for(var i=0; i<product.length; i++) {
    //     var id = product[i].item._id
    //     var qty = product[i].qty;
    //     Product.findById(id, function(err, found) {
    //       if(err) {
    //         console.log(err);
    //       } else if(found.visible == "متوفر" && found.instock >= qty) {
    //         res.render('shop/checkout', {total: cart.totalPrice});
    //       } else {
    //         req.flash("error", "احد المنتجات غير متوفر بالمخزون");
    //         res.redirect('/shop/shopping-cart');
    //       }
    //     });
    // }

      order.save(function(err, result) {
        if(err) {
          req.flash('error', err.message);
          res.redirect('/shop/checkout')
        } else {
          console.log('mail sent');
          req.session.cart = null;
          req.flash("success", "تمت عملية الشراء بنجاح");
          res.redirect("/");
        }
      });
    }
  });
});

// nonRegistered Checkout
router.post('/noncheckout', function(req, res) {
  var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth   : {
        user: process.env.adminemail,
        pass: process.env.adminpassword
    }
  });
  var mailOptions = {
    to     : process.env.chekcemail,
    from   : process.env.adminemail,
    subject: 'طلب جديد',
    html: '<h1 style="text-align: center;">طلب جديد</h1>'+
    '<h1 style="text-align: center;">'+req.body.name+" :الاسم المشتري  </h1>"+
    '<h1 style="text-align: center;">' + req.body.phone+" :رقم الهاتف </h1>"+
    '<h1 style="text-align: center;"> المدينة: ' + req.body.city+"</h1>"+
    '<h1 style="text-align: center;"> العنوان: ' + req.body.address+"</h1>"+
    '<h1 style="text-align: center;"> السعر الكلي: ' + cart.totalPrice+"₪"+"</h1>",
  };
  
  // You entered an email
  if(req.body.email){
    smtpTransport.sendMail(mailOptions, function(err) {
      console.log('mail sent');
    });
    
    smtpTransport.sendMail(mailOptions, function(err) {
      if(err) {
        req.flash('error', err.message);
        res.redirect('/shop/checkout')
      } else {
        var cart = new Cart(req.session.cart);
        
        var order = new Order({
          cart     : cart,
          city     : req.body.city,
          address  : req.body.address,
          email    : req.body.email,
          phone    : req.body.phone,
          name     : req.body.name,
          paymentId: req.params.id
        });
        console.log('mail sent');

        // Stock
        order.items.forEach(function(item) {
          var id = item.item._id
          Product.findById(id, function(err, found) {
            if(err) {
                console.log(err);
            } else {
              found.instock = found.instock - item.qty;
              if(found.instock === 0) {
                found.visible = 'غير متوفر';
              }
              found.save();
            }
          });
        });
  
        order.save(function(err, result) {
          if(err) {
            req.flash('error', err.message);
            res.redirect('/shop/checkout')
          } else {
            console.log('mail sent');
            req.session.cart = null;
            req.flash("success", "تمت عملية الشراء بنجاح");
            res.redirect("/");
          }
        });
      }
    });
    console.log('There is a email');

  // You haven't entered an email
  } else {
    smtpTransport.sendMail(mailOptions, function(err) {
      if(err) {
        req.flash('error', err.message);
        res.redirect('/shop/checkout')
      } else {
        var cart = new Cart(req.session.cart);
        
        var order = new Order({
          cart     : cart,
          city     : req.body.city,
          address  : req.body.address,
          phone    : req.body.phone,
          name     : req.body.name,
          paymentId: req.params.id
        });
        console.log('mail sent');
  
        // Stock
        order.items.forEach(function(item) {
          var id = item.item._id
          Product.findById(id, function(err, found) {
            if(err) {
                console.log(err);
            } else {
              found.instock = found.instock - item.qty;
              if(found.instock === 0) {
                found.visible = 'غير متوفر';
              }
              found.save();
            }
          });
        });
      }
    });
    console.log('There is no email');
  }
});  

module.exports = router;