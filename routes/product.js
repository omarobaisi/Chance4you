var express    = require('express');
var Product    = require('../models/product');
var middleware = require("../middleware");
var router     = express.Router();

// Image Upload
var multer  = require('multer');
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
	callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function (req, file, cb) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
	cloud_name: 'disgiza9s',
	api_key   : process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// Index
router.get('/', function(req, res) {
    Product.find({}, function(err, found) {
        if(err) {
            console.log(err);
        } else {
            res.render('product/index', {product: found});
        }
    });
});

// Search
router.get('/search', function(req, res) {
    var noMatch = null;
    if(req.query.page) {
        var a = req.query.page;
        console.log(a);
    }
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Product.find({$or: [{name: regex,}, {category: regex}]}, function(err, found){
            if(err){
                console.log(err);
            } else {
                if(found.length < 1) {
                    noMatch = "لا يوجد منتجات بنفس هذا الاسم";
                }
                res.render("product/search",{product: found, noMatch: noMatch, a: a});
            }
        });
    } else {
        req.flash('error', 'لا يمكننا القيام بذلك');
        res.redirect('/product')
    }
});

// Discount
router.get('/search/discount', function(req, res) {
    var noMatch = null;
    Product.find({}, function(err, found){
        if(err){
            console.log(err);
        } else {
            if(found.length < 1) {
                noMatch = "لا يوجد تخفيضات حاليا";
            }
            res.render("product/discount",{product:found, noMatch: noMatch});
        }
    });
});

// Out of stock
router.get('/search/outofstock', middleware.checkAdmin, function(req, res) {
    var noMatch = null;
    Product.find({}, function(err, found){
        if(err){
            console.log(err);
        } else {
            if(found.length < 1) {
                noMatch = "لا يوجد منتجات";
            }
            res.render("product/outstock",{product:found, noMatch: noMatch});
        }
    });
});

// New
router.get('/new', middleware.checkAdmin, function(req, res) {
    res.render('product/new')
});

// Create
router.post('/', middleware.checkAdmin, upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.product.image   = result.secure_url;
        req.body.product.imageId = result.public_id;
		Product.create(req.body.product, function(err, newproduct) {
		    if (err) {
			    req.flash('error', err.message);
			    return res.redirect('back');
            }
            req.flash("success", "تمت اضافة منتج بنجاح");
		    res.redirect('/product/' + newproduct.id);
		});
	});
});

// Show
router.get('/:id', function(req, res) {
    Product.find({}, function(err, allfound) {
        if(err) {
            console.log(err);
        } else {
            Product.findById(req.params.id, function(err, found) {
                if(err) {
                    console.log(err);
                } else {
                    res.render('product/show', {product: found, products: allfound});
                }
            });
        }
    });
});

// Edit 
router.get('/:id/edit', middleware.checkAdmin, function(req, res) {
    Product.findById(req.params.id, function(err, found) {
        if(err) {
            console.log(err);
        } else {
            res.render('product/edit', {product: found});
        }
    });
});

// Update
router.put('/:id', middleware.checkAdmin, upload.single('image'), function(req, res){
	Product.findById(req.params.id, async function(err, found){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(found.imageId);
                  var result        = await cloudinary.v2.uploader.upload(req.file.path);
                      found.imageId = result.public_id;
                      found.image   = result.secure_url;
              } catch(err) {
                  console.log(err);
                  return res.redirect('back');
              }
            }
            found.name         = req.body.name;
            found.category     = req.body.category;
            found.price        = req.body.price;
            found.instock      = req.body.instock;
            found.description  = req.body.description;
            found.size         = req.body.size;
            found.color        = req.body.color;
            found.weight       = req.body.weight;
            found.dicountprice = req.body.dicountprice;
            found.visible      = req.body.visible;
            found.save();
            req.flash("success", "تم تعديل المنتج بنجاح");
            res.redirect('/product/' + found._id);
        }
    });
});

// Delete
router.delete('/:id', middleware.checkAdmin, function(req, res){

	Product.findById(req.params.id, async function(err, found) {
        if(err) {
          console.log(err);
          return res.redirect('back');
        }
        try {
            await cloudinary.v2.uploader.destroy(found.imageId);
            found.remove();
            req.flash("success", "تم حذف المنتج بنجاح");
            res.redirect('/product');
        } catch(err) {
            if(err) {
              console.log(err);
              return res.redirect('back');
            }
        }
    });

});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;