const local = require('./localStrategy');
const { User } = require('../models');          //bringing in localStrategy verification method && db models

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);        // first argument -> error
    });

    passport.deserializeUser((id, done) => {        // used when?
        console.log('deserialize');
        User.findOne({ where: { id } })
            .then(user => {console.log(user,'ussss'); done(null, user)})
            .catch((err) => done(err));
    })

    local(passport);
};