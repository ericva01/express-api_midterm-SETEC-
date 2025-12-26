var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const models = require('./models'); // Import models from index.js

var indexRouter = require('./routes/index');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/order');
const orderDetailRouter = require('./routes/orderDetail');
var app = express();

// WARNING: { force: true } will drop and recreate the tables.
// Use with caution in a production environment.
models.sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));


app.use('/order', orderRouter);
app.use('/order-detail', orderDetailRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/users', usersRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
