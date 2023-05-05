const { Router } = require('express');
const controller = require('./controller');

const adminRouter = Router();

adminRouter.get('/general', controller.getGeneralMenu);

adminRouter.get('/general/:id', controller.getGeneralMenu);

//prettier-ignore
adminRouter.get('/general_move_item_to_inactive/:id',controller.moveItemtoInactive);
//prettier-ignore
adminRouter.get('/general_move_item_to_current/:id', controller.moveItemtoCurrent);

adminRouter.post('/general_add_menu', controller.addMenuItem);

adminRouter.get('/general_delete_item/:id', controller.deleteMenuItem);

adminRouter.post('/general_edit_menu/:id', controller.updateMenuItem);

adminRouter.post('/general_update_store_status', controller.updateStoreStatus);

module.exports = adminRouter;
