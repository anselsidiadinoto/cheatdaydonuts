const pool = require('../../db');
const bodyParser = require('body-parser');
const { all } = require('../menu_item/adminRoutes');
const { CLIENT_RENEG_LIMIT } = require('tls');

const adminLogin = function (req, res) {
  res.render('admin-login');
};

const adminLogout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/admin/');
  });
};

const adminRegister = function (req, res) {
  res.render('admin-register');
};

const addNewAdmin = async function (req, res) {
  let { admin_user, admin_password } = req.body;

  console.log(admin_user, admin_password);

  let errors = [];

  if (!admin_user || !admin_password) {
    errors.push({ message: 'Please enter all fields!' });
  }
  if (admin_password < 4) {
    errors.push({ message: 'Password should be atleast 4 characters!' });
  }
  if (errors.length > 0) {
    res.render('admin-register', { errors });
  }

  try {
    let adminUserCheck = await pool.query(
      'SELECT * FROM admin_account WHERE admin_name = $1',
      [admin_user]
    );

    if (adminUserCheck.rows.length > 0) {
      errors.push({ message: 'User already exists!' });
      res.render('admin-register', { errors });
    } else {
      let newAdmin = await pool.query(
        'INSERT INTO admin_account (admin_name, admin_password) VALUES ($1, $2) RETURNING id, admin_name, admin_password',
        [admin_user, admin_password]
      );

      res.redirect('/admin/');
    }
  } catch (error) {
    console.log(error);
  }
};

const isAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: 'Who are you ??? pls login' });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  adminRegister,
  addNewAdmin,
  isAuth,
};
