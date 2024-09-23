-- Create the database
CREATE DATABASE alofa;
-- Connect to the database
\ c alofa -- 1. USER MANAGEMENT
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL
);
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    role_id INT NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'active'
);
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    role_id INT NOT NULL
);
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
    )
);
-- 2. SHIPPING 
CREATE TABLE shipping_method (
    shipping_method_id SERIAL PRIMARY KEY,
    courier VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);
CREATE TABLE shipping_address (
    shipping_address_id SERIAL PRIMARY KEY,
    address_line VARCHAR(255) NOT NULL,
    barangay VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    customer_id INT NOT NULL
);
CREATE TABLE shipping (
    shipping_id SERIAL PRIMARY KEY,
    shipping_date DATE NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL,
    tracking_number VARCHAR(255) NOT NULL,
    shipping_method_id INT NOT NULL,
    shipping_address_id INT NOT NULL
);
-- 3. PRODUCT
CREATE TABLE product_category (
    product_category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    stock_quantity INTEGER NOT NULL,
    last_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_id INT
);
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    product_category_id INT NOT NULL,
    inventory_id INT
);
CREATE TABLE product_order (
    product_order_id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    product_id INT NOT NULL
);
-- 4. ORDER TRANSACTION
CREATE TABLE order_transaction (
    order_id SERIAL PRIMARY KEY,
    customer_id INT,
    total_amount NUMERIC(10, 2) NOT NULL,
    date_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(255) NOT NULL,
    reference_number VARCHAR(255) UNIQUE,
    payment_id INT NOT NULL,
    shipping_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id),
    FOREIGN KEY (shipping_id) REFERENCES shipping(shipping_id) -- Assuming a Shipping table
);
-- 5. PAYMENT
CREATE TABLE payment_method (
    payment_method_id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount_paid NUMERIC(10, 2),
    proof_image TEXT NOT NULL,
    payment_method_id INT NOT NULL,
    order_id INT NOT NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(payment_method_id),
    FOREIGN KEY (order_id) REFERENCES order_transaction(order_id)
);
CREATE TABLE payment_verification (
    payment_verification_id SERIAL PRIMARY KEY,
    verification_date DATE NOT NULL,
    is_verified BOOLEAN NOT NULL,
    employee_id INT NOT NULL,
    payment_id INT NOT NULL
);
-- Add foreign key constraints
-- User Management
ALTER TABLE employee
ADD CONSTRAINT fk_employee_role FOREIGN KEY (role_id) REFERENCES role(role_id);
ALTER TABLE customer
ADD CONSTRAINT fk_customer_role FOREIGN KEY (role_id) REFERENCES role(role_id);
ALTER TABLE user_account
ADD CONSTRAINT fk_user_account_employee FOREIGN KEY (employee_id) REFERENCES employee(employee_id);
ALTER TABLE user_account
ADD CONSTRAINT fk_user_account_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id);
-- Shipping
ALTER TABLE shipping_address
ADD CONSTRAINT fk_shipping_address_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id);
ALTER TABLE shipping
ADD CONSTRAINT fk_shipping_method FOREIGN KEY (shipping_method_id) REFERENCES shipping_method(shipping_method_id);
ALTER TABLE shipping
ADD CONSTRAINT fk_shipping_address FOREIGN KEY (shipping_address_id) REFERENCES shipping_address(shipping_address_id);
-- Product
ALTER TABLE product
ADD CONSTRAINT fk_product_category FOREIGN KEY (product_category_id) REFERENCES product_category(product_category_id);
ALTER TABLE product
ADD CONSTRAINT fk_product_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id);
ALTER TABLE product_order
ADD CONSTRAINT fk_product_order_product FOREIGN KEY (product_id) REFERENCES product(product_id);
-- Inventory (Dependencies)
ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE;
-- Order Transaction
ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id);
ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_product_order FOREIGN KEY (product_order_id) REFERENCES product_order(product_order_id);
ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_shipping FOREIGN KEY (shipping_id) REFERENCES shipping(shipping_id);
ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_payment FOREIGN KEY (payment_id) REFERENCES payment(payment_id);
-- Payment
ALTER TABLE payment
ADD CONSTRAINT fk_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_method(payment_method_id);
ALTER TABLE payment
ADD CONSTRAINT fk_payment_order_transaction FOREIGN KEY (order_transaction_id) REFERENCES order_transaction(order_transaction_id);
ALTER TABLE payment
ADD CONSTRAINT fk_payment_payment_verification FOREIGN KEY (payment_verification_id) REFERENCES payment_verification(payment_verification_id);
ALTER TABLE payment_verification
ADD CONSTRAINT fk_payment_verification_employee FOREIGN KEY (employee_id) REFERENCES employee(employee_id);
ALTER TABLE payment_verification
ADD CONSTRAINT fk_payment_verification_payment FOREIGN KEY (payment_id) REFERENCES payment(payment_id);
-- RECENT EDITS --
-- create employee status table
CREATE TABLE employee_status (
    status_id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);
-- employee table drop status column
ALTER TABLE employee DROP COLUMN status;
-- employee table add status_id column & make foreign key
ALTER TABLE employee
ADD COLUMN status_id INT NOT NULL,
    ADD CONSTRAINT fk_employee_status_employee FOREIGN KEY (status_id) REFERENCES employee_status(status_id);
-- delete exisiting employee and user_account records
DELETE FROM user_account;
DELETE FROM employee;
ALTER SEQUENCE user_account_user_account_id_seq RESTART WITH 1;
ALTER SEQUENCE employee_employee_id_seq RESTART WITH 1;
-- NEW CHANGES SEPTEMBER 7 8PM --
-- note: this is for inventory-product-stock_in process
-- drop columns in product table
ALTER TABLE product DROP COLUMN inventory_id,
    DROP COLUMN status,
    DROP COLUMN unit_price,
    DROP COLUMN image;
ADD COLUMN product_status_id INT REFERENCES product_status(status_id) ON DELETE CASCADE;
-- create product_variation table
CREATE TABLE product_variation (
    variation_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    product_status_id INT REFERENCES product_status(status_id) ON DELETE CASCADE,
    type VARCHAR(255),
    -- e.g., 'Color', 'Size'
    value VARCHAR(255),
    -- e.g., 'Red', 'Large'
    unit_price NUMERIC(10, 2),
    -- Price for this specific variation
    sku VARCHAR(100) UNIQUE -- Unique SKU for the variation
    image TEXT,
);
-- CREAT product_status table
CREATE TABLE product_status (
    status_id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
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
-- modify inventory table
ALTER TABLE inventory
ADD COLUMN variation_id INT REFERENCES product_variation(variation_id),
    DROP COLUMN product_id;
-- Remove the old product_id reference, since we're using variation_id now
-- create supplier table
CREATE TABLE supplier (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending'
);
-- create bulk stock_in table
CREATE TABLE stock_in (
    stock_in_id SERIAL PRIMARY KEY,
    reference_number VARCHAR(255) NOT NULL,
    supplier_id INT REFERENCES supplier(supplier_id),
    stock_in_date DATE DEFAULT CURRENT_DATE
);
-- create stock_in_items table
CREATE TABLE stock_in_items (
    stock_in_item_id SERIAL PRIMARY KEY,
    stock_in_id INT REFERENCES stock_in(stock_in_id),
    variation_id INT REFERENCES product_variation(variation_id),
    quantity INT NOT NULL
);
-- SEPTEMBER 11 11PM
-- create cart table
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    -- Auto-incrementing primary key
    session_id VARCHAR(255) NULL,
    -- Used for guest users
    customer_id INT NULL,
    -- Used for logged-in users
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Cart creation time
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Last update to the cart
    status VARCHAR(20) DEFAULT 'active',
    -- Cart status ('active', 'completed', etc.)
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) -- Customer foreign key
);
-- September 20 10:50PM
-- DROP TABLE product_order and order_transaction
DROP TABLE product_order CASCADE;
DROP TABLE order_transaction CASCADE;
-- recreate order_transaction table
CREATE TABLE order_transaction (
    order_transaction_id SERIAL PRIMARY KEY,
    customer_id INT,
    total_amount NUMERIC(10, 2) NOT NULL,
    date_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(255) NOT NULL,
    reference_number VARCHAR(255) UNIQUE,
    payment_id INT NOT NULL,
    shipping_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id),
    FOREIGN KEY (shipping_id) REFERENCES shipping(shipping_id) -- Assuming a Shipping table
);
-- Create stock_out table
CREATE TABLE stock_out (
    stock_out_id SERIAL PRIMARY KEY,
    reference_number VARCHAR(255) UNIQUE,
    stock_out_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_transaction_id INT,
    -- Can be NULL for non-order-related stock-out (e.g., damaged items)
    employee_id INT,
    FOREIGN KEY (order_transaction_id) REFERENCES order_transaction(order_transaction_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);
-- Create stock_out_items table
CREATE TABLE stock_out_items (
    stock_out_item_id SERIAL PRIMARY KEY,
    stock_out_id INT NOT NULL,
    variation_id INT NOT NULL,
    quantity INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    FOREIGN KEY (stock_out_id) REFERENCES stock_out(stock_out_id),
    FOREIGN KEY (variation_id) REFERENCES product_variation(variation_id) -- Link to the product variation being stocked out
);
-- DROP TABLE payment
DROP TABLE payment CASCADE;
-- CREATE TABLE payment
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount_paid NUMERIC(10, 2),
    proof_image TEXT NOT NULL,
    payment_method_id INT NOT NULL,
    order_id INT NOT NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(payment_method_id),
    FOREIGN KEY (order_id) REFERENCES order_transaction(order_id)
);