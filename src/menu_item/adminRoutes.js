const { Router } = require('express');
const controller = require('./controller');

const adminRouter = Router();

adminRouter.get('/general', controller.getAllMenuItem);

adminRouter.post('/general_add_menu', controller.addMenuItem);

adminRouter.get('/general_delete_item/:id', controller.deleteMenuItem);

adminRouter.post('/general_edit_menu/:id', controller.updateMenuItem);

module.exports = adminRouter;
