const pool = require('../../db');
const queries = require('./queries');
const bodyParser = require('body-parser');
const { all } = require('./adminRoutes');
const { CLIENT_RENEG_LIMIT } = require('tls');

const getGeneralMenu = async function (req, res) {
  let menuItemsCurrent;
  let menuItemsInactive;
  let menuDisplay = req.params.page_display;
  let menuDisplayId = 1; //General page defaults to current menu
  let storeStatusDisplay;
  let dashboardRoute;
  let storeStatus;

  if (menuDisplay === 'current_menu') {
    menuDisplayId = 1;
    dashboardRoute = 'admin-general';
  } else if (menuDisplay === 'inactive_menu') {
    menuDisplayId = 2;
    dashboardRoute = 'admin-general-inactive';
  } else {
    dashboardRoute = 'admin-general';
  }

  try {
    const results_1 = await pool.query(
      'SELECT * FROM menu_item WHERE id_menu_item_status = $1 ORDER BY id ASC',
      [menuDisplayId]
    );
    const results_2 = await pool.query(
      'SELECT * FROM dashboard_store_status ORDER BY id ASC'
    );

    const result_3 = await pool.query(
      'SELECT * FROM dashboard_order_dates ORDER BY id ASC'
    );

    menuItemsCurrent = results_1.rows;
    storeStatus = results_2.rows[0].store_status;

    if (storeStatus === 'open') {
      storeStatusDisplay = results_2.rows[0].open_date;
    } else if (storeStatus === 'closed') {
      storeStatusDisplay = results_2.rows[1].open_date;
    }

    res.render(dashboardRoute, {
      menuItemInfo: menuItemsCurrent,
      storeStatusDate: storeStatusDisplay,
      orderDates: result_3.rows,
    });
    // --
  } catch (error) {
    console.log(error);
  }
};

const updateStoreStatus = async function (req, res) {
  let dateOptions;
  let insertValues;
  let values = '';

  try {
    await pool.query(
      'UPDATE dashboard_store_status SET open_date=$1, store_status=$2 WHERE id=1',
      [req.body.store_status_date, req.body.store_status_option]
    );

    await pool.query('TRUNCATE dashboard_order_dates RESTART IDENTITY');

    if (req.body.open_date_option === undefined) {
      res.redirect('/admin/general');
    } else {
      dateOptions = req.body.open_date_option;

      if (typeof dateOptions == 'string') {
        dateOptions = [req.body.open_date_option];
      }

      for (let i = 0; i < dateOptions.length; i++) {
        values += `('${dateOptions[i]}'), `;
      }
      insertValues = values.slice(0, -2);
      await pool.query(
        `INSERT INTO dashboard_order_dates(order_dates) VALUES${insertValues}`
      );
      res.redirect('/admin/general');
    }
  } catch (error) {
    console.log(error);
  }
};

const moveItemtoInactive = function (req, res) {
  pool.query(
    'UPDATE menu_item SET id_menu_item_status = 2 WHERE id = $1',
    [req.params.id],
    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/admin/general');
      }
    }
  );
};

const moveItemtoCurrent = function (req, res) {
  pool.query(
    'UPDATE menu_item SET id_menu_item_status = 1 WHERE id = $1',
    [req.params.id],
    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/admin/general/inactive_menu');
      }
    }
  );
};

const addMenuItem = function (req, res) {
  pool.query(
    'INSERT INTO menu_item(menu_name, menu_description, menu_price) VALUES($1, $2, $3)',
    [req.body.name, req.body.description, req.body.price],
    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/admin/general');
      }
    }
  );
};

const deleteMenuItem = function (req, res) {
  console.log(req.params.id);
  pool.query(
    'DELETE FROM menu_item WHERE id = $1',
    [req.params.id],
    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.redirect(`/admin/general/${req.params.page_display}`);
      }
    }
  );
};

const updateMenuItem = function (req, res) {
  pool.query(
    'UPDATE menu_item SET menu_name=$1, menu_description=$2, menu_price=$3 WHERE id=$4',
    [req.body.name, req.body.description, req.body.price, req.params.id],

    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.redirect(`/admin/general/${req.params.page_display}`);
      }
    }
  );
};

const getAdminOrders = async function (req, res) {
  try {
    let ordersQuery = await pool.query(
      'SELECT * FROM admin_orders ORDER BY id ASC'
    );

    let itemsQuery = await pool.query('SELECT * FROM admin_order_items');

    for (let i = 0; i < ordersQuery.rows.length; i++) {
      let query_order_id = ordersQuery.rows[i].id;
      let all_order_items = itemsQuery.rows;
      let order_items_array = all_order_items.filter((item) => {
        return item.id_order === query_order_id;
      });
      ordersQuery.rows[i].order_items = order_items_array;
    }

    res.render('admin-orders', {
      orders: ordersQuery.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const sortAdminOrder = async function (req, res) {
  try {
    let sort_value = req.body.sort_option;
    let ordersQuery;
    let itemsQuery;

    if (sort_value == 1) {
      ordersQuery = await pool.query(
        'SELECT * FROM admin_orders WHERE status_id=1 ORDER BY id ASC'
      );
    } else if (sort_value == 2) {
      ordersQuery = await pool.query(
        'SELECT * FROM admin_orders WHERE status_id=1 ORDER BY date_value ASC, delivery_time ASC'
      );
    }

    itemsQuery = await pool.query('SELECT * FROM admin_order_items');

    for (let i = 0; i < ordersQuery.rows.length; i++) {
      let query_order_id = ordersQuery.rows[i].id;
      let all_order_items = itemsQuery.rows;
      let order_items_array = all_order_items.filter((item) => {
        return item.id_order === query_order_id;
      });
      ordersQuery.rows[i].order_items = order_items_array;
    }

    // console.log(ordersQuery);
    res.render('admin-orders', {
      orders: ordersQuery.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const sortAdminOrderCompleted = async function (req, res) {
  try {
    let sort_value = req.body.sort_option;
    let ordersQuery;
    let itemsQuery;

    if (sort_value == 1) {
      ordersQuery = await pool.query(
        'SELECT * FROM admin_orders WHERE status_id=2 ORDER BY id ASC'
      );
    } else if (sort_value == 2) {
      ordersQuery = await pool.query(
        'SELECT * FROM admin_orders WHERE status_id=2 ORDER BY date_value ASC, delivery_time ASC'
      );
    }

    itemsQuery = await pool.query('SELECT * FROM admin_order_items');

    for (let i = 0; i < ordersQuery.rows.length; i++) {
      let query_order_id = ordersQuery.rows[i].id;
      let all_order_items = itemsQuery.rows;
      let order_items_array = all_order_items.filter((item) => {
        return item.id_order === query_order_id;
      });
      ordersQuery.rows[i].order_items = order_items_array;
    }

    // console.log(ordersQuery);
    res.render('admin-orders-completed', {
      orders: ordersQuery.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrdersCurrent = async function (req, res) {
  try {
    let ordersQuery = await pool.query(
      'SELECT * FROM admin_orders WHERE status_id=1 ORDER BY id ASC'
    );

    let itemsQuery = await pool.query('SELECT * FROM admin_order_items');

    for (let i = 0; i < ordersQuery.rows.length; i++) {
      let query_order_id = ordersQuery.rows[i].id;
      let all_order_items = itemsQuery.rows;
      let order_items_array = all_order_items.filter((item) => {
        return item.id_order === query_order_id;
      });
      ordersQuery.rows[i].order_items = order_items_array;
    }

    res.render('admin-orders', {
      orders: ordersQuery.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrdersCompleted = async function (req, res) {
  try {
    let ordersQuery = await pool.query(
      'SELECT * FROM admin_orders WHERE status_id=2 ORDER BY id ASC'
    );

    let itemsQuery = await pool.query('SELECT * FROM admin_order_items');

    for (let i = 0; i < ordersQuery.rows.length; i++) {
      let query_order_id = ordersQuery.rows[i].id;
      let all_order_items = itemsQuery.rows;
      let order_items_array = all_order_items.filter((item) => {
        return item.id_order === query_order_id;
      });
      ordersQuery.rows[i].order_items = order_items_array;
    }

    res.render('admin-orders-completed', {
      orders: ordersQuery.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateDeliveryCost = async function (req, res) {
  console.log(req.params.order_id);
  console.log();

  try {
    await pool.query(
      'UPDATE orders_information SET delivery_cost = $1 WHERE id = $2',
      [req.body.delivery_cost, req.params.order_id]
    );

    res.redirect('/admin/orders/current');
  } catch (error) {
    console.log(error);
  }
};

const getOrderInvoice = async function (req, res) {
  try {
    let ordersQuery = await pool.query(
      'SELECT * FROM admin_orders WHERE id=$1',
      [req.params.order_id]
    );

    let itemsQuery = await pool.query(
      'SELECT * FROM admin_order_items WHERE id_order=$1',
      [req.params.order_id]
    );

    res.render('admin-orders-invoice', {
      orders: ordersQuery.rows,
      items: itemsQuery.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const completeOrder = async function (req, res) {
  try {
    await pool.query(
      'UPDATE orders_information SET id_order_status=2 WHERE id=$1',
      [req.params.order_id]
    );

    res.redirect('/admin/orders/current');
  } catch (error) {
    console.log(error);
  }
};

const reactivateOrder = async function (req, res) {
  try {
    await pool.query(
      'UPDATE orders_information SET id_order_status=1 WHERE id=$1',
      [req.params.order_id]
    );

    res.redirect('/admin/orders/completed');
  } catch (error) {
    console.log(error);
  }
};

const overview = async function (req, res) {
  try {
    let query_2 = await pool.query(
      'SELECT * FROM admin_orders WHERE status_id=1 ORDER BY id ASC'
    );

    let query_3 = await pool.query(
      'SELECT * FROM admin_orders_summary WHERE status_id=1 ORDER BY item_id ASC'
    );

    const results_2 = await pool.query(
      'SELECT * FROM dashboard_store_status ORDER BY id ASC'
    );

    storeStatus = results_2.rows[0].store_status;

    if (storeStatus === 'open') {
      storeStatusDisplay = results_2.rows[0].open_date;
    } else if (storeStatus === 'closed') {
      storeStatusDisplay = results_2.rows[1].open_date;
    }

    let total_orders = query_2.rows.length;
    let total_donuts = 0;

    for (let i = 0; i < query_3.rows.length; i++) {
      total_donuts += query_3.rows[i].quantity;
    }

    let donut_data = query_3.rows;
    let donut_total_each = donut_data,
      donut_grouped = Array.from(
        donut_total_each
          .reduce(
            (m, { menu_name, quantity }) =>
              m.set(menu_name, (m.get(menu_name) || 0) + quantity),
            new Map()
          )
          .entries(),
        ([menu_name, quantity]) => ({ menu_name, quantity })
      );

    console.log(donut_grouped);

    res.render('admin-orders-overview', {
      totalOrders: total_orders,
      totalDonuts: total_donuts,
      eachDonuts: donut_grouped,
      storeStatusDate: storeStatusDisplay,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteOrderCurrent = async function (req, res) {
  try {
    await pool.query('DELETE FROM admin_orders WHERE id=$1', [
      req.params.order_id,
    ]);

    res.redirect('/admin/orders/current');
  } catch (error) {
    console.log(error);
  }
};

const deleteOrderCompleted = async function (req, res) {
  try {
    await pool.query('DELETE FROM admin_orders WHERE id=$1', [
      req.params.order_id,
    ]);

    res.redirect('/admin/orders/completed');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  moveItemtoInactive,
  moveItemtoCurrent,
  updateStoreStatus,
  getGeneralMenu,
  getAdminOrders,
  updateDeliveryCost,
  getOrderInvoice,
  sortAdminOrder,
  sortAdminOrderCompleted,
  getOrdersCurrent,
  getOrdersCompleted,
  completeOrder,
  reactivateOrder,
  overview,
  deleteOrderCurrent,
  deleteOrderCompleted,
};
