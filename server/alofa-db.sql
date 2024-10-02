-- Create the database
CREATE DATABASE alofa;
-- Connect to the database
\ c alofa -- 1. USER MANAGEMENT
DROP TABLE IF EXISTS role CASCADE;
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL
);
DROP TABLE IF EXISTS employee_status CASCADE;
CREATE TABLE employee_status (
    status_id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);
DROP TABLE IF EXISTS employee CASCADE;
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    role_id INT NOT NULL,
    status_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (status_id) REFERENCES employee_status(status_id)
);
DROP TABLE IF EXISTS customer CASCADE;
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);
DROP TABLE IF EXISTS user_account CASCADE;
CREATE TABLE user_account (
    user_account_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id INT,
    customer_id INT,
    CHECK (
        (
            employee_id IS NOT NULL
            AND customer_id IS NULL
        )
        OR (
            employee_id IS NULL
            AND customer_id IS NOT NULL
        )
    ),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
-- 2. SHIPPING 
DROP TABLE IF EXISTS shipping_method CASCADE;
CREATE TABLE shipping_method (
    shipping_method_id SERIAL PRIMARY KEY,
    courier VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);
DROP TABLE IF EXISTS shipping_address CASCADE;
CREATE TABLE shipping_address (
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    shipping_address_id SERIAL PRIMARY KEY,
    address_line VARCHAR(255) NOT NULL,
    barangay VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
DROP TABLE IF EXISTS shipping CASCADE;
CREATE TABLE shipping (
    shipping_id SERIAL PRIMARY KEY,
    shipping_date DATE NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL,
    tracking_number VARCHAR(255) NOT NULL,
    shipping_method_id INT NOT NULL,
    shipping_address_id INT NOT NULL,
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_method(shipping_method_id),
    FOREIGN KEY (shipping_address_id) REFERENCES shipping_address(shipping_address_id)
);
-- 3. PRODUCT
DROP TABLE IF EXISTS product_category CASCADE;
CREATE TABLE product_category (
    product_category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
DROP TABLE IF EXISTS product_status CASCADE;
CREATE TABLE product_status (
    status_id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);
DROP TABLE IF EXISTS product CASCADE;
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    product_category_id INT NOT NULL,
    product_status_id INT NOT NULL,
    FOREIGN KEY (product_category_id) REFERENCES product_category(product_category_id),
    FOREIGN KEY (product_status_id) REFERENCES product_status(status_id)
);
DROP TABLE IF EXISTS product_variation CASCADE;
CREATE TABLE product_variation (
    variation_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    product_status_id INT REFERENCES product_status(status_id) ON DELETE CASCADE,
    type VARCHAR(255),
    value VARCHAR(255),
    unit_price NUMERIC(10, 2),
    sku VARCHAR(100) UNIQUE,
    image TEXT,
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (product_status_id) REFERENCES product_status(status_id)
);
-- Product Inventory
DROP TABLE IF EXISTS inventory CASCADE;
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    stock_quantity INTEGER NOT NULL,
    last_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    variation_id INT,
    FOREIGN KEY (variation_id) REFERENCES product_variation(variation_id)
);
DROP TABLE IF EXISTS stock_in CASCADE;
CREATE TABLE stock_in (
    stock_in_id SERIAL PRIMARY KEY,
    reference_number VARCHAR(255) NOT NULL UNIQUE,
    supplier_id INT,
    stock_in_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id INT,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);
DROP TABLE IF EXISTS stock_in_items CASCADE;
CREATE TABLE stock_in_items (
    stock_in_item_id SERIAL PRIMARY KEY,
    stock_in_id INT REFERENCES stock_in(stock_in_id),
    variation_id INT REFERENCES product_variation(variation_id),
    quantity INT NOT NULL,
    FOREIGN KEY (stock_in_id) REFERENCES stock_in(stock_in_id),
    FOREIGN KEY (variation_id) REFERENCES product_variation(variation_id)
);
DROP TABLE IF EXISTS stock_out CASCADE;
CREATE TABLE stock_out (
    stock_out_id SERIAL PRIMARY KEY,
    reference_number VARCHAR(255) UNIQUE,
    stock_out_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_transaction_id INT,
    employee_id INT,
    FOREIGN KEY (order_transaction_id) REFERENCES order_transaction(order_transaction_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);
DROP TABLE IF EXISTS stock_out_items CASCADE;
CREATE TABLE stock_out_items (
    stock_out_item_id SERIAL PRIMARY KEY,
    stock_out_id INT NOT NULL,
    variation_id INT NOT NULL,
    quantity INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    FOREIGN KEY (stock_out_id) REFERENCES stock_out(stock_out_id),
    FOREIGN KEY (variation_id) REFERENCES product_variation(variation_id)
);
DROP TABLE IF EXISTS supplier CASCADE;
CREATE TABLE supplier (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending'
);
-- 4. ORDER TRANSACTION
DROP TABLE IF EXISTS cart CASCADE;
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    customer_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    -- Cart status ('active', 'completed', etc.)
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE
    SET NULL
);
DROP TABLE IF EXISTS cart_items CASCADE;
CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    variation_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (variation_id) REFERENCES product_variation(variation_id) ON DELETE CASCADE
);
DROP TABLE IF EXISTS order_transaction CASCADE;
CREATE TABLE order_transaction (
    order_transaction_id SERIAL PRIMARY KEY,
    customer_id INT,
    cart_id INT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    date_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(255) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    payment_status VARCHAR(255) NOT NULL,
    proof_image TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL,
    shipping_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE
    SET NULL,
        FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
        FOREIGN KEY (shipping_id) REFERENCES shipping(shipping_id) ON DELETE CASCADE
);
-- 5. PAYMENT VERIFICATION
DROP TABLE IF EXISTS payment_verification CASCADE;
CREATE TABLE payment_verification (
    payment_verification_id SERIAL PRIMARY KEY,
    verification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL,
    employee_id INT NOT NULL,
    order_transaction_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (order_transaction_id) REFERENCES order_transaction(order_transaction_id) ON DELETE CASCADE
);
-- Insert values into product_status
INSERT INTO product_status (description)
VALUES ('Available');
INSERT INTO product_status (description)
VALUES ('Out of Stock');
INSERT INTO product_status (description)
VALUES ('Discontinued');
INSERT INTO product_status (description)
VALUES ('Archived');
-- Insert values into role
INSERT INTO role (name, description)
VALUES ('Admin', 'System Administrator');
INSERT INTO role (name, description)
VALUES ('Employee', 'Employee of the company');
INSERT INTO role (name, description)
VALUES ('Customer', 'Customer of the company');
-- Insert values into employee_status
INSERT INTO employee_status (description)
VALUES ('Active');
INSERT INTO employee_status (description)
VALUES ('Inactive');
INSERT INTO employee_status (description)
VALUES ('On Leave');
INSERT INTO employee_status (description)
VALUES ('Terminated');