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

const addCart = async function (req, res) {
  let menuId = req.body.menu_id;
  let menuQuantity = req.body.quantity;
  let values = '';
  let insertValues;
  let cartIdQuery;
  let cartId;

  try {
    await pool.query(
      `INSERT INTO cart(cart_status)
        VALUES ('cart_created');`
    );

    cartIdQuery = await pool.query(
      'SELECT id FROM cart ORDER BY id DESC LIMIT 1;'
    );

    cartId = cartIdQuery.rows[0].id;

    for (let i = 0; i < menuId.length; i++) {
      values += `(${cartId}, ${menuId[i]}, ${menuQuantity[i]}), `;
    }

    insertValues = values.slice(0, -2);

    await pool.query(
      `INSERT INTO order_cart(id_cart, id_menu_item, quantity)
         VALUES ${insertValues};`
    );

    res.redirect(`/cart/${cartId}`);
  } catch (error) {
    console.log(error);
  }
};

let getOrderCart = async function (req, res) {
  try {
    let cartDeliveryInfoQuery = await pool.query(
      'SELECT * FROM cart WHERE id = $1',
      [req.params.cart_id]
    );

    let cartItemsQuery = await pool.query(
      'SELECT * FROM order_items_review WHERE id_cart = $1',
      [req.params.cart_id]
    );

    let cart_id = req.params.cart_id;
    let total_price = 0;
    let total_quantity = 0;

    for (let i = 0; i < cartItemsQuery.rows.length; i++) {
      total_price += parseInt(cartItemsQuery.rows[i].each_subtotal);
      total_quantity += parseInt(cartItemsQuery.rows[i].quantity);
    }
    console.log(total_price, total_quantity);

    res.render('order-delivery-info', {
      cartItems: cartItemsQuery.rows,
      totalPrice: total_price,
      totalQuantity: total_quantity,
      cartId: cart_id,
      deliveryInfo: cartDeliveryInfoQuery.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
};

let addDeliveryInfo = async function (req, res) {
  try {
    await pool.query(
      'UPDATE cart SET customer_name=$1, delivery_address=$2, phone_number=$3, email=$4, delivery_time=$5, order_notes=$6, total_price=$7 WHERE id=$8',
      [
        req.body.customer_name,
        req.body.delivery_address,
        req.body.phone,
        req.body.email,
        req.body.delivery_time,
        req.body.order_notes,
        req.body.total_price,
        req.params.cart_id,
      ]
    );

    let cartItemsQuery = await pool.query(
      'SELECT * FROM order_items_review WHERE id_cart = $1',
      [req.params.cart_id]
    );

    let cartDeliveryInfoQuery = await pool.query(
      'SELECT * FROM cart WHERE id = $1',
      [req.params.cart_id]
    );

    let cart_id = req.params.cart_id;
    let total_price = 0;
    let total_quantity = 0;

    for (let i = 0; i < cartItemsQuery.rows.length; i++) {
      total_price += parseInt(cartItemsQuery.rows[i].each_subtotal);
      total_quantity += parseInt(cartItemsQuery.rows[i].quantity);
    }

    res.render('order-review', {
      orderItems: cartItemsQuery.rows,
      deliveryInfo: cartDeliveryInfoQuery.rows[0],
      totalPrice: total_price,
      totalQuantity: total_quantity,
      cartId: cart_id,
    });
  } catch (error) {
    console.log(error);
  }
};

let submitOrder = async function (req, res) {
  let menuId = req.body.item_id;
  let menuQuantity = req.body.item_quantity;
  let values = '';
  let insertValues;
  let orderIdQuery;
  let orderId;
  try {
    await pool.query(
      'INSERT INTO orders_information(customer_name, delivery_address, phone_number, email, delivery_time, order_notes, total_price) VALUES($1, $2, $3, $4, $5, $6, $7)',
      [
        req.body.name,
        req.body.address,
        req.body.phone,
        req.body.email,
        req.body.time,
        req.body.notes,
        req.body.total_price,
      ]
    );

    let orderIdQuery = await pool.query(
      'SELECT id FROM orders_information ORDER BY id DESC LIMIT 1;'
    );

    orderId = await orderIdQuery.rows[0].id;

    for (let i = 0; i < menuId.length; i++) {
      values += `(${orderId}, ${menuId[i]}, ${menuQuantity[i]}), `;
    }

    insertValues = values.slice(0, -2);

    await pool.query(
      `INSERT INTO orders_items(id_order, id_menu_item, quantity) VALUES${insertValues}`
    );

    console.log(insertValues);
    console.log('order submitzzz');

    res.render('order-confirmation');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOrderStart,
  addCart,
  getOrderCart,
  addDeliveryInfo,
  submitOrder,
};
