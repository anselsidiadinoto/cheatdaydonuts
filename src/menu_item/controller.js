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

const getAllMenuItem = function (req, res) {
  pool.query('SELECT * FROM menu_item', function (error, results) {
    if (error) {
      console.log(err);
    } else {
      res.render('admin-general', { menuItemInfo: results.rows });
    }
  });
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
  getAllMenuItem,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
};
