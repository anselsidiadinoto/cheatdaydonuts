const express = require('express');
const adminRoutes = require('./src/menu_item/adminRoutes');
const orderRoutes = require('./src/order_item/orderRoutes');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.enable('trust proxy');
app.set('trust proxy', 1);

app.use('/', orderRoutes);

app.use('/admin/', adminRoutes);

// app.use('/api/menu_item', menuItemRoutes);

app.listen(process.env.PORT || 3000, function () {
  console.log('server is up baby');
});
