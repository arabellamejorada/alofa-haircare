-- Create the database
CREATE DATABASE alofa;

-- Connect to the database
\c alofa

-- 1. USER MANAGEMENT
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
    role_id INT NOT NULL
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
    CHECK ((employee_id IS NOT NULL AND customer_id IS NULL) OR (employee_id IS NULL AND customer_id IS NOT NULL))
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
    stock_in_date DATE NOT NULL
);

CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    product_category_id INT NOT NULL,
    inventory_id INT NOT NULL
);

CREATE TABLE product_order (
    product_order_id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    product_id INT NOT NULL
);

-- 4. ORDER TRANSACTION
CREATE TABLE order_transaction (
    order_transaction_id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(255) NOT NULL,
    customer_id INT NOT NULL,
    product_order_id INT NOT NULL,
    shipping_id INT NOT NULL,
    payment_id INT NOT NULL
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
    reference_number VARCHAR(255) NOT NULL,
    payment_method_id INT NOT NULL,
    order_transaction_id INT NOT NULL,
    payment_verification_id INT NOT NULL
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
ADD CONSTRAINT fk_employee_role 
FOREIGN KEY (role_id) REFERENCES role(role_id);

ALTER TABLE customer
ADD CONSTRAINT fk_customer_role 
FOREIGN KEY (role_id) REFERENCES role(role_id);

ALTER TABLE user_account
ADD CONSTRAINT fk_user_account_employee 
FOREIGN KEY (employee_id) REFERENCES employee(employee_id);

ALTER TABLE user_account
ADD CONSTRAINT fk_user_account_customer 
FOREIGN KEY (customer_id) REFERENCES customer(customer_id);

-- Shipping
ALTER TABLE shipping_address
ADD CONSTRAINT fk_shipping_address_customer 
FOREIGN KEY (customer_id) REFERENCES customer(customer_id);

ALTER TABLE shipping
ADD CONSTRAINT fk_shipping_method 
FOREIGN KEY (shipping_method_id) REFERENCES shipping_method(shipping_method_id);

ALTER TABLE shipping
ADD CONSTRAINT fk_shipping_address 
FOREIGN KEY (shipping_address_id) REFERENCES shipping_address(shipping_address_id);

-- Product
ALTER TABLE product
ADD CONSTRAINT fk_product_category 
FOREIGN KEY (product_category_id) REFERENCES product_category(product_category_id);

ALTER TABLE product
ADD CONSTRAINT fk_product_inventory 
FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id);

ALTER TABLE product_order
ADD CONSTRAINT fk_product_order_product 
FOREIGN KEY (product_id) REFERENCES product(product_id);

-- Inventory (Dependencies)
ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_product 
FOREIGN KEY (product_id) REFERENCES product(product_id);

ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_order_transaction 
FOREIGN KEY (order_transaction_id) REFERENCES order_transaction(order_transaction_id);

-- Order Transaction
ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_customer 
FOREIGN KEY (customer_id) REFERENCES customer(customer_id);

ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_product_order 
FOREIGN KEY (product_order_id) REFERENCES product_order(product_order_id);

ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_shipping 
FOREIGN KEY (shipping_id) REFERENCES shipping(shipping_id);

ALTER TABLE order_transaction
ADD CONSTRAINT fk_order_transaction_payment 
FOREIGN KEY (payment_id) REFERENCES payment(payment_id);

-- Payment
ALTER TABLE payment
ADD CONSTRAINT fk_payment_method 
FOREIGN KEY (payment_method_id) REFERENCES payment_method(payment_method_id);

ALTER TABLE payment
ADD CONSTRAINT fk_payment_order_transaction 
FOREIGN KEY (order_transaction_id) REFERENCES order_transaction(order_transaction_id);

ALTER TABLE payment
ADD CONSTRAINT fk_payment_payment_verification 
FOREIGN KEY (payment_verification_id) REFERENCES payment_verification(payment_verification_id);

ALTER TABLE payment_verification
ADD CONSTRAINT fk_payment_verification_employee 
FOREIGN KEY (employee_id) REFERENCES employee(employee_id);

ALTER TABLE payment_verification
ADD CONSTRAINT fk_payment_verification_payment
FOREIGN KEY (payment_id) REFERENCES payment(payment_id);
