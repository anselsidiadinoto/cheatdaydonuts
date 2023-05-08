const pool = require('../../db');
const queries = require('./queries');
const bodyParser = require('body-parser');

const getGeneralMenu = async function (req, res) {
  let menuItemsCurrent;
  let menuItemsInactive;
  let menuDisplay = req.params.page_display;
  let menuDisplayId = 1; //General page defaults to current menu
  let storeStatusDisplay;
  let dashboardRoute;
  let storeStatus;

  console.log(menuDisplay);

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
    });
    // --
  } catch (error) {
    console.log(error);
  }
};

const updateStoreStatus = async function (req, res) {
  try {
    const results_1 = await pool.query(
      'UPDATE dashboard_store_status SET open_date=$1, store_status=$2 WHERE id=1',
      [req.body.store_status_date, req.body.store_status_option]
    );

    res.redirect('/admin/general');
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

module.exports = {
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  moveItemtoInactive,
  moveItemtoCurrent,
  updateStoreStatus,
  getGeneralMenu,
};
