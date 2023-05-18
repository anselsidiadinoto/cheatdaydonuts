const { Router } = require('express');
const controller = require('./controller');
const contollerUpload = require('./controllerUpload');
const loginController = require('../authentication/auth');
const fs = require('fs');

const session = require('express-session');
const passport = require('passport');

const adminRouter = Router();

// --------------- POSTGRESS SESSION ---------------

require('dotenv').config({ path: __dirname + '/../../.env' });

const pgSessionConnectionObj = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pgSession = require('connect-pg-simple')(session);
const pgStoreConfig = {
  connectionObject: pgSessionConnectionObj,
  createTableIfMissing: true,
};

adminRouter.use(
  session({
    store: new pgSession(pgStoreConfig),
    secret: 'cat keyboard',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

// --------------- PASSPORT AUTHENTICATION -------------

const passportConfig = require('../authentication/passportConfig');

adminRouter.use(passport.initialize());
adminRouter.use(passport.session());

adminRouter.use(function (req, res, next) {
  console.log(req.session);
  console.log(req.user);
  next();
});

adminRouter.get('/', loginController.adminLogin);
//prettier-ignore
adminRouter.post('/', passport.authenticate('local', {
    successRedirect: '/admin/general',
    failureRedirect: '/admin',
  })
);

adminRouter.post('/logout', loginController.adminLogout);

// --------------- ADD NEW ADMIN USER ROUTES--------------

adminRouter.get('/register', loginController.adminRegister);

adminRouter.post('/register', loginController.addNewAdmin);

// ------------------- ADMIN ROUTES ----------------------

//prettier-ignore
adminRouter.get('/general', loginController.isAuth, controller.getGeneralMenu);
//prettier-ignore
adminRouter.get('/general/:page_display', loginController.isAuth, controller.getGeneralMenu);
//prettier-ignore
adminRouter.get('/general_move_item_to_inactive/:page_display/:id', loginController.isAuth, controller.moveItemtoInactive);
//prettier-ignore
adminRouter.get('/general_move_item_to_current/:page_display/:id', loginController.isAuth, controller.moveItemtoCurrent);
//prettier-ignore
adminRouter.post('/general_add_menu', loginController.isAuth, controller.addMenuItem);
//prettier-ignore
adminRouter.get('/general_delete_item/:page_display/:id', loginController.isAuth, controller.deleteMenuItem);
//prettier-ignore
adminRouter.post('/general_edit_menu/:page_display/:id', loginController.isAuth, controller.updateMenuItem);
//prettier-ignore
adminRouter.post('/general_update_store_status', loginController.isAuth, controller.updateStoreStatus);
//prettier-ignore
adminRouter.get('/orders', loginController.isAuth, controller.getAdminOrders);
//prettier-ignore
adminRouter.post('/update_delivery_cost/:order_id', loginController.isAuth, controller.updateDeliveryCost);
//prettier-ignore
adminRouter.get('/orders/invoice/:order_id', loginController.isAuth, controller.getOrderInvoice);
//prettier-ignore
adminRouter.use( '/upload', loginController.isAuth, contollerUpload.uploadMenuImage);

module.exports = adminRouter;
