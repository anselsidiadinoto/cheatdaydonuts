const { Router } = require('express');
const controller = require('./controller');

const adminRouter = Router();
//prettier-ignore
adminRouter.get('/general', controller.getGeneralMenu);
//prettier-ignore
adminRouter.get('/general/:page_display', controller.getGeneralMenu);
//prettier-ignore
adminRouter.get('/general_move_item_to_inactive/:page_display/:id',controller.moveItemtoInactive);
//prettier-ignore
adminRouter.get('/general_move_item_to_current/:page_display/:id', controller.moveItemtoCurrent);
//prettier-ignore
adminRouter.post('/general_add_menu', controller.addMenuItem);
//prettier-ignore
adminRouter.get('/general_delete_item/:page_display/:id',controller.deleteMenuItem);
//prettier-ignore
adminRouter.post('/general_edit_menu/:page_display/:id',controller.updateMenuItem);
//prettier-ignore
adminRouter.post('/general_update_store_status', controller.updateStoreStatus);
//prettier-ignore
adminRouter.get('/orders', controller.getAdminOrders);
//prettier-ignore
adminRouter.post('/update_delivery_cost/:order_id',controller.updateDeliveryCost);

module.exports = adminRouter;
