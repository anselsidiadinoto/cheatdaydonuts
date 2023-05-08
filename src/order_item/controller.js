const pool = require('../../db');
// const queries = require('./queries')
const bodyParser = require('body-parser');

const getOrderStart = async function (req, res) {
  let menuItems;
  let storeStatusDisplay;

  try {
    const results_1 = await pool.query(
      'SELECT * FROM menu_item WHERE id_menu_item_status = 1 ORDER BY id ASC'
    );
    const results_2 = await pool.query(
      'SELECT * FROM dashboard_store_status ORDER BY id ASC'
    );

    menuItems = results_1.rows;
    storeStatus = results_2.rows[0].store_status;

    storeStatus = results_2.rows[0].store_status;
    if (storeStatus === 'open') {
      storeStatusDisplay = results_2.rows[0].open_date;
    } else if (storeStatus === 'closed') {
      storeStatusDisplay = results_2.rows[1].open_date;
    }

    res.render('order-menu', {
      menuItemInfo: menuItems,
      storeStatusDate: storeStatusDisplay,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOrderStart,
};
