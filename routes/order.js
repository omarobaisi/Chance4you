var express    = require('express');
var Product    = require('../models/product');
var Cart       = require('../models/cart');
var Order      = require('../models/order');
var middleware = require("../middleware");
var router     = express.Router();

// Orders
router.get('/', middleware.checkAdmin, function(req, res) {
  Order.find({}, function(err, orders) {
    if(err) {
      console.log(err);
    }
      var cart;
      orders.forEach(function(order) {
        cart        = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render("order/orders", {orders: orders});
  });
});

// Delivered
router.post('/deliver/:id', function(req, res) {
  Order.findById(req.params.id, function(err, found) {
    if (err) {
        console.log(err);
    } else if(found.delivered === false) {
        found.delivered = true;
        found.save();
        res.redirect("/order");
    } else if(found.delivered === true) {
        found.delivered = false;
        found.save();
        res.redirect("/order");
    }
  });
});

// Delivered
router.post('/indeliver/:id', function(req, res) {
  Order.findById(req.params.id, function(err, found) {
    if (err) {
        console.log(err);
    } else if(found.delivered === false) {
        found.delivered = true;
        found.save();
        res.redirect("/order/"+req.params.id);
    } else if(found.delivered === true) {
        found.delivered = false;
        found.save();
        res.redirect("/order/"+req.params.id);
    }
  });
});

// Show order
router.get('/:id', middleware.checkAdmin, function(req, res) {
  Order.findById(req.params.id, function(err, order) {
      if(err) {
          console.log(err);
      } else {
          var cart;
          cart        = new Cart(order.cart);
          order.items = cart.generateArray();
          res.render('order/show', {order: order});
      }
  });
});

// Delete
router.delete('/delete/:id', function(req, res) {
  Order.findByIdAndRemove(req.params.id, function(err, Removed) {
    if (err) {
        console.log(err);
    } else {
        res.redirect("/order");
    }
  });
});

module.exports = router;