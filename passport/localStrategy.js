const LocalStrategy = require('passport-local').Strategy;       
const bcrypt = require('bcrypt');

const { User } = require('../models');      //bc index exports all models

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',              // from passport documentation
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email } });
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: 'Password does not match.' })
                }
            } else {
                done(null, false, { message: 'User does not exists' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}