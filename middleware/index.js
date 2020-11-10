// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "عليك بتسجيل الدخول اولا");
    res.redirect("/user/login");
}

middlewareObj.checkAdmin = function(req, res, next) {
	if(req.isAuthenticated()){
        if(req.user.isAdmin) {
            next();
        } else {
            req.flash("error", "You dont have a premetion to do that");
            res.redirect("back");
        }
	} else {
        req.flash("error", "عليك بتسجيل الدخول اولا");
        res.redirect("/user/login");
	}
}

module.exports = middlewareObj;