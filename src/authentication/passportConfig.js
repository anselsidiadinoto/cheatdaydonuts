const LocalStrategy = require('passport-local').Strategy;
const pool = require('../../db');
const session = require('express-session');
const passport = require('passport');

// add bycript later

const costumFields = {
  usernameField: 'admin_user',
  passwordField: 'admin_password',
};

const verifyCallback = async function (username, password, done) {
  let searchUser = await pool.query(
    'SELECT * FROM admin_account WHERE admin_name = $1',
    [username]
  );
  if (searchUser.rows.length > 0) {
    const user = searchUser.rows[0];
    console.log(user.admin_password);
    1;
    if (password == user.admin_password) {
      console.log(user.admin_password);
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password is incorrect' });
    }
  } else {
    // if user doesnt exist
    return done(null, false, { message: 'User is nonexistent' });
  }
};

const strategy = new LocalStrategy(costumFields, verifyCallback);

passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    let deserializeUserQuery = await pool.query(
      'SELECT * FROM admin_account WHERE id = $1',
      [id]
    );
    return done(null, deserializeUserQuery.rows[0]);
  } catch (error) {
    console.log(error);
  }
});
