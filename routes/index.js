var express = require('express');
var router = express.Router();

router.get('/', function(res, res) {
    res.redirect('/product');
});

router.get('/contact', function(req, res) {
    res.render('contact');
});

module.exports = router;