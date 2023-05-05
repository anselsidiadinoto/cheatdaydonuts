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

-- DROP TABLE IF EXISTS dashboard_general CASCADE;
-- CREATE TABLE dashboard_general (
--     id SERIAL NOT NULL,
--     id_dashboard_store_status INT NOT NULL,

--     CONSTRAINT pk_id_dashboard_general PRIMARY KEY (id),
--     CONSTRAINT uc_id_dashboard_general UNIQUE (id)
--     -- CONSTRAINT uc_id_dashboard_menu_display UNIQUE (id_dashboard_menu_display)
-- );

-- DROP TABLE IF EXISTS dashboard_menu_display CASCADE;
-- CREATE TABLE dashboard_menu_display (

--     id SERIAL NOT NULL,
--     id_dashboard_general INT NOT NULL,
--     id_menu_item_status INT NOT NULL,
--     id_menu_item INT NOT NULL,

--     CONSTRAINT uc_id_dashboard_menu_display UNIQUE (id)
-- );

DROP TABLE IF EXISTS dashboard_store_status CASCADE;
CREATE TABLE dashboard_store_status (
    id SERIAL NOT NULL,
    store_status VARCHAR(255) NOT NULL,
    open_date VARCHAR(255) NOT NULL,
    menu_display VARCHAR(255),

    CONSTRAINT uc_id_dashbaord_store_status UNIQUE (id),
    CONSTRAINT pk_id_dashboard_store_status PRIMARY KEY (id)
);

    INSERT INTO dashboard_store_status (store_status, open_date, menu_display)
    VALUES
        ('open', 'Saturday, 16 June 2022', 'current'), ('closed', 'Store is currently', '');


ALTER TABLE menu_item ADD CONSTRAINT fk_id_menu_item_status 
    FOREIGN KEY(id_menu_item_status) 
    REFERENCES menu_item_status (id) ON UPDATE CASCADE ON DELETE CASCADE;



