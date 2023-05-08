const { Router } = require('express');
const controller = require('./controller');

const orderRouter = Router();

orderRouter.get('/order', controller.getOrderStart);

module.exports = orderRouter;
