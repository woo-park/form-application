exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();     //pass to next cb
    } else {
        req.flash('loginError', "Please Log In First");
        res.redirect('/');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

