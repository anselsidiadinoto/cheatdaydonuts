const express = require('express');
const adminRoutes = require('./src/menu_item/adminRoutes');

const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(express.json());

app.get('/', function (req, res) {
  res.render('order_home');
});

app.get('/order', function (req, res) {
  res.render('order-menu');
});

app.get('/order-delivery-info', function (req, res) {
  res.render('order-delivery-info');
});

app.get('/order-review', function (req, res) {
  res.render('order-review');
});

app.get('/order-confirmation', function (req, res) {
  res.render('order-confirmation');
});

app.get('/admin-orders', function (req, res) {
  res.render('admin-orders');
});

app.use('/admin/', adminRoutes);

// app.use('/api/menu_item', menuItemRoutes);

app.listen(3000, function () {
  console.log('server is up baby');
});
