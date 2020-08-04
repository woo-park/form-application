const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const {email, nick, password, money } = req.body;       
    try{
        console.log('/join reached');
        const exUser = await User.findOne({ where: { email } } );       // interesting to see sending { email }
        if(exUser) {
            req.flash('joinError', 'User has been already registered');
            return res.redirect('/join');
        }
        //else gotta sign up
        const hash = await bcrypt.hash(password, 12);  
        await User.create({                             //creates directly on to db, with the help of sequelize ORM
            email,
            nick,           // ES6 -> nick:nick,
            password: hash,
            money,
        });
        return res.redirect('/');   // redirect back to home

    } catch(error) {
        console.error(error);
        return next(error);     //pass to next error handling middleware
    }
});


router.post('/login', isNotLoggedIn, async(req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            next(authError);        //pass on to error middleware
        }
        if (!user) {
            console.log(info,' :info');
            req.flash('loginError', info.message);      //check info
            res.redirect('/');
        }

        console.log(user,'useraaaa')

        return req.login(user, (loginError) => {            //!important  // whats this     // i think req.login is given by the passport
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            //else
            console.log('login all passed');
            return res.redirect('/')    
        });

    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();                                       // req has logout method???
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;