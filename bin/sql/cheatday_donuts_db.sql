-- psql -U anselsidiadinoto -d cheatday_donuts < ./bin/sql/cheatday_donuts_db.sql 
-- POSTGRESS COMMAND TO MAKE DATABASE

DROP TABLE IF EXISTS menu_item CASCADE;
CREATE TABLE menu_item (
    id SERIAL NOT NULL,
    menu_name VARCHAR(255) NOT NULL,
    menu_description TEXT NOT NULL,
    menu_price DECIMAL(8,0) NOT NULL,
    id_menu_item_status INT NOT NULL DEFAULT 1,

    CONSTRAINT pk_menu_item PRIMARY KEY (id),
    CONSTRAINT uc_id_menu_item UNIQUE (id)
);

----------------------------- menu_item TEST VALUES ----------------------------- 
    INSERT INTO menu_item 
        (menu_name, menu_description, menu_price, id_menu_item_status)
    VALUES 
        ('Donat Strobery', 'lezat banget omg mau makan banyak', '15000', 1),
        ('Donat Melon', 'kayak melon gede seger', '13000', 1),
        ('Donat Coklat', 'Coklatnya dari mars gila', '12000', 1),
        ('Donat Zuchini', 'Sehat kayak dari perancis', '20000', 1);
---------------------------------------------------------------------------------


DROP TABLE IF EXISTS menu_item_status CASCADE;
CREATE TABLE menu_item_status (
    id SERIAL NOT NULL,
    menu_status VARCHAR(255) NOT NULL,

    CONSTRAINT pk_id_menu_item_status PRIMARY KEY (id),
    CONSTRAINT uc_id_menu_item_status UNIQUE (id)
);

    INSERT INTO menu_item_status (menu_status) 
    VALUES 
        ('current'), --id 1
        ('inactive'); --id 2

DROP TABLE IF EXISTS dashboard_store_status CASCADE;
CREATE TABLE dashboard_store_status (
    id SERIAL NOT NULL,
    store_status VARCHAR(255) NOT NULL,
    open_date VARCHAR(255) NOT NULL,
    menu_display VARCHAR(255),

    CONSTRAINT uc_id_dashboard_store_status UNIQUE (id),
    CONSTRAINT pk_id_dashboard_store_status PRIMARY KEY (id)
);

    INSERT INTO dashboard_store_status (store_status, open_date, menu_display)
    VALUES
        ('open', 'Saturday, 16 June 2022', 'current'), ('closed', 'Store is currently closed', '');

DROP TABLE IF EXISTS dashboard_order_dates CASCADE;
CREATE TABLE dashboard_order_dates (
    id SERIAL NOT NULL,
    order_dates VARCHAR(255),

    CONSTRAINT uc_id_order_dates UNIQUE (id),
    CONSTRAINT pk_id_order_dates PRIMARY KEY (id)
);


DROP TABLE IF EXISTS cart CASCADE;
CREATE TABLE cart (
    id SERIAL NOT NULL,
    cart_status VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    delivery_address TEXT,
    phone_number DECIMAL(12,0),
    email VARCHAR(255),
    delivery_date VARCHAR(255),
    delivery_time VARCHAR(255),
    order_notes TEXT,
    total_price DECIMAL(12,0),


    CONSTRAINT uc_id_cart UNIQUE (id),
    CONSTRAINT pk_id_cart PRIMARY KEY (id)
);

    -- INSERT INTO cart (id, cart_name)
    -- VALUES 
    --     (1, 'ansel'), (2, 'duann'), (3, 'jason');


DROP TABLE IF EXISTS order_cart CASCADE;
CREATE TABLE order_cart (
    id SERIAL NOT NULL,
    id_cart INT NOT NULL,
    id_menu_item INT NOT NULL,
    quantity INT NOT NULL,

    CONSTRAINT uc_id_order_cart UNIQUE (id),
    CONSTRAINT pk_id_order_cart PRIMARY KEY (id)
);

    -- INSERT INTO order_cart (id_cart, id_menu_item, quantity)
    -- VALUES
    -- (1, 4, 5), (2, 2, 4), (2, 1, 3), (3, 4, 5), (3, 2, 4), (3, 3, 6);

DROP TABLE IF EXISTS orders_information CASCADE;
CREATE TABLE orders_information (
    id SERIAL NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    delivery_address TEXT NOT NULL,
    phone_number BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    delivery_date VARCHAR(255) NOT NULL,
    delivery_time VARCHAR(255) NOT NULL,
    order_notes TEXT,
    total_price DECIMAL(12,0) NOT NULL,
    delivery_cost DECIMAL(12,0) DEFAULT 0,
    order_time TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    id_order_status INT NOT NULL DEFAULT 1, 


    CONSTRAINT uc_id_orders_information UNIQUE (id),
    CONSTRAINT pk_id_orders_information PRIMARY KEY (id)
);


DROP TABLE IF EXISTS order_status CASCADE;
CREATE TABLE order_status (
    id SERIAL NOT NULL,
    order_status VARCHAR(255),

    CONSTRAINT uc_id_order_status UNIQUE (id),
    CONSTRAINT pk_id_order_status PRIMARY KEY (id)
);

    INSERT INTO order_status(order_status) 
        VALUES ('in-progress'), ('completed');


DROP TABLE IF EXISTS orders_items CASCADE;
CREATE TABLE orders_items (
    id SERIAL NOT NULL,
    id_order INT NOT NULL,
    id_menu_item INT NOT NULL,
    quantity INT NOT NULL,

    CONSTRAINT uc_id_orders_items UNIQUE (id),
    CONSTRAINT pk_id_orders_items PRIMARY KEY (id)
);

ALTER TABLE menu_item ADD CONSTRAINT fk_id_menu_item_status 
    FOREIGN KEY(id_menu_item_status) 
    REFERENCES menu_item_status (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE order_cart ADD CONSTRAINT fk_id_cart_order_cart
    FOREIGN KEY(id_cart) 
    REFERENCES cart (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE order_cart ADD CONSTRAINT fk_id_menu_item_cart
    FOREIGN KEY(id_menu_item) 
    REFERENCES menu_item (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE orders_information ADD CONSTRAINT fk_id_order_status 
    FOREIGN KEY(id_order_status)
    REFERENCES order_status(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE orders_items ADD CONSTRAINT fk_id_order_item
    FOREIGN KEY(id_menu_item)
    REFERENCES menu_item (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER DATABASE cheatday_donuts SET TIMEZONE TO 'Singapore';

----------------------

CREATE VIEW order_items_review AS
    SELECT 
    order_cart.id_cart, 
    menu_item.menu_name, 
    menu_item.id,
    menu_item.menu_price, 
    order_cart.quantity,
    menu_price * quantity AS each_subtotal

    FROM order_cart JOIN menu_item
    ON order_cart.id_menu_item = menu_item.id;

CREATE VIEW admin_order_items AS
    SELECT
    orders_items.id_order,
    menu_item.menu_name,
    menu_item.id,
    orders_items.quantity,
    menu_item.menu_price,
    menu_price * quantity AS each_subtotal
    
    FROM orders_items JOIN menu_item
    ON orders_items.id_menu_item = menu_item.id;

CREATE VIEW admin_orders AS
    SELECT 
    orders_information.id,
    orders_information.customer_name,
    orders_information.delivery_address,
    orders_information.phone_number,
    orders_information.email,
    orders_information.delivery_date,
    orders_information.delivery_time,
    orders_information.order_notes,
    orders_information.total_price,
    total_price + delivery_cost AS final_price,
    orders_information.delivery_cost,
    to_char(orders_information.order_time, 'Dy DD-MM-YYYY HH24:MI') AS order_time,
    orders_information.id_order_status

    FROM orders_information;



    





