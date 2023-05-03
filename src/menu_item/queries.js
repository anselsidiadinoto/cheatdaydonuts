const getMenuItem = 'SELECT * FROM menu_item';
const getMenuItemById = 'SELECT * FROM menu_item WHERE id = $1';

module.exports = {
  getMenuItem,
  getMenuItemById,
};
