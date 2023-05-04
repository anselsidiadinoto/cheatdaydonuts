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

const getAllCurrentMenu = async function (req, res) {
  let menuItemsCurrent;
  let menuItemsInactive;
  try {
    const results_1 = await pool.query(
      'SELECT * FROM menu_item WHERE id_menu_item_status = 1 ORDER BY id ASC'
    ); // console.log(results_1.rows);
    const results_2 = await pool.query(
      'SELECT * FROM menu_item WHERE id_menu_item_status = 2 ORDER BY id ASC'
    );
    menuItemsCurrent = results_1.rows;
    menuItemsInactive = results_2.rows;

    res.render('admin-general', { menuItemInfo: menuItemsCurrent });
  } catch (error) {
    console.log(error);
  }
  console.log('-------');
  console.log(menuItemsCurrent);
  console.log(menuItemsInactive);

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

const getAllInactiveMenu = function (req, res) {
  pool.query(
    'SELECT * FROM menu_item WHERE id_menu_item_status = 2 ORDER BY id ASC',
    function (error, results) {
      if (error) {
        console.log(err);
      } else {
        res.render('admin-general-inactive', { menuItemInfo: results.rows });
      }
    }
  );
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
        res.redirect('/admin/general_show_inactive');
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
  getAllCurrentMenu,
  getAllInactiveMenu,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  moveItemtoInactive,
  moveItemtoCurrent,
};
