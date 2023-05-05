const pool = require('../../db');
const queries = require('./queries');
const bodyParser = require('body-parser');

const getMenuItem = function (req, res) {
  pool.query(queries.getMenuItem, function (error, results) {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getMenuItemById = function (req, res) {
  const id = parseInt(req.params.id);

  pool.query(queries.getMenuItemById, [id], function (error, results) {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getGeneralMenu = async function (req, res) {
  let menuItemsCurrent;
  let menuDisplay = req.params.id;
  let menuDisplayId = 1; //General page defaults to current menu
  let menuTab = '';

  if (menuDisplay === 'current_menu') {
    menuDisplayId = 1;
  } else if (menuDisplay === 'inactive_menu') {
    menuDisplayId = 2;
    menuTab = '-inactive';
  }

  let dashboardRoute = 'admin-general' + menuTab;

  console.log(menuDisplayId);
  console.log(menuDisplay);
  console.log(dashboardRoute);

  try {
    const results_1 = await pool.query(
      'SELECT * FROM menu_item WHERE id_menu_item_status = $1 ORDER BY id ASC',
      [menuDisplayId]
    );
    const results_2 = await pool.query(
      'SELECT * FROM dashboard_store_status ORDER BY id ASC'
    );
    menuItemsCurrent = results_1.rows;
    let storeStatusOpen = results_2.rows[0].open_date;
    let storeStatusClosed = results_2.rows[1].open_date;
    let storeStatus = results_2.rows[0].store_status;

    console.log(storeStatus);

    if (storeStatus === 'open') {
      res.render(dashboardRoute, {
        menuItemInfo: menuItemsCurrent,
        storeStatusDate: storeStatusOpen,
      });
    } else if (storeStatus === 'closed') {
      res.render(dashboardRoute, {
        menuItemInfo: menuItemsCurrent,
        storeStatusDate: storeStatusClosed,
      });
    }
  } catch (error) {
    console.log(error);
  }
  // console.log('-------');
  // console.log(menuItemsCurrent);
  // console.log(storeStatus);

  // pool.query(
  //   'SELECT * FROM menu_item WHERE id_menu_item_status = 1 ORDER BY id ASC',
  //   function (error, results) {
  //     if (error) {
  //       console.log(err);
  //     } else {
  //       // console.log(results.rows);
  //       return results.rows;
  //       // res.render('admin-general', { menuItemInfo: results.rows });
  //     }
  //   }
  // );
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

// const getAllInactiveMenu = function (req, res) {
//   pool.query(
//     'UPDATE dashboard_store_status SET menu_display=$1 WHERE id = 1',
//     ['inactive'],
//     function (error, results) {
//       if (error) {
//         console.log(error);
//       } else {
//         res.redirect('/admin/general');
//       }
//     }
//   );
// };

// const getAllCurrentMenu = function (req, res) {
//   console.log(req.params.id);
//   // res.redirect('/admin/general');
// };

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
        res.redirect('/admin/general');
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
        res.redirect('/admin/general');
      }
    }
  );
};

module.exports = {
  getMenuItem,
  getMenuItemById,
  // getAllCurrentMenu,
  // getAllInactiveMenu,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  moveItemtoInactive,
  moveItemtoCurrent,
  updateStoreStatus,
  getGeneralMenu,
};
