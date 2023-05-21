const { Router } = require('express');
const controller = require('./controller');

const orderRouter = Router();

orderRouter.get('/', controller.getOrderStart);

orderRouter.get('/order', controller.getOrderStart);

orderRouter.post('/order_add_cart', controller.addCart);

orderRouter.get('/cart/:cart_id', controller.getOrderCart);

orderRouter.post('/cart_review/:cart_id', controller.addDeliveryInfo);

orderRouter.post('/submit_order/:cart_id', controller.submitOrder);

module.exports = orderRouter;
