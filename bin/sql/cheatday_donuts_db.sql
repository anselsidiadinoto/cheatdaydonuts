DROP TABLE IF EXISTS menu_item;
CREATE TABLE menu_item (
    id BIGSERIAL NOT NULL,
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
        ('Donat Coklat', 'Coklatnya dari mars gila', '12000', 1);
---------------------------------------------------------------------------------


DROP TABLE IF EXISTS menu_item_status;
CREATE TABLE menu_item_status (
    id SERIAL NOT NULL,
    menu_status VARCHAR(255) NOT NULL,

    CONSTRAINT uc_id_menu_item_status UNIQUE (id)
);

    INSERT INTO menu_item_status (menu_status) 
    VALUES 
        ('current'), --id 1
        ('inactive'); --id 2


ALTER TABLE menu_item ADD CONSTRAINT fk_id_menu_item_status FOREIGN KEY(id_menu_item_status) 
    REFERENCES menu_item_status (id) ON UPDATE CASCADE;

