const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const expressLayouts = require('express-ejs-layouts');
// var ejsLocals = require('ejs-locals');   

const app = express();
sequelize.sync();
passportConfig(passport);

// const sessionMiddleware = session({
//   saveUninitialized: false,
//   resave: false,
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
// })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ejs-layouts setting
app.set("layout extractScripts", true);
app.set('layout', 'layout');

app.use(expressLayouts);


app.set('port', process.env.PORT || 8010);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(flash());

app.use('/', indexRouter);
// app.use('/auth', authRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log('running on port ', app.get('port'));
});

module.exports = app;