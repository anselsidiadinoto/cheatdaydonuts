
-- CART ITEMS FROM ORDER MENU --
SELECT * FROM order_cart
    JOIN menu_item ON order_cart.id_menu_item = menu_item.id;

CREATE VIEW order_items_review AS
    SELECT 
    order_cart.id_cart, 
    menu_item.menu_name, 
    menu_item.menu_price, 
    order_cart.quantity,
    menu_price * quantity AS each_subtotal

    FROM order_cart JOIN menu_item
    ON order_cart.id_menu_item = menu_item.id;