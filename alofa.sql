CREATE DATABASE alofa;

-- USER MANAGEMENT
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE user_account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- to ensure that each user account is associated with either an employee or a customer but not both
ALTER TABLE user_account
ADD CONSTRAINT one_of_employee_or_customer
CHECK ((employee_id IS NOT NULL AND customer_id IS NULL) OR (employee_id IS NULL AND customer_id IS NOT NULL));


-- SHIPPING 
CREATE TABLE shipping_address (
    id SERIAL PRIMARY KEY,
    address_line VARCHAR(255) NOT NULL,
    barangay VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL
);

CREATE TABLE shipping_method (
    id SERIAL PRIMARY KEY,
    courier VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE shipping (
    id SERIAL PRIMARY KEY,
    shipping_date DATE NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL,
    tracking_number VARCHAR(255) NOT NULL
);

-- PRODUCT
CREATE TABLE product_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    stock_quantity INTEGER NOT NULL,
    stock_in_date DATE NOT NULL
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE product_order (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- PAYMENT
CREATE TABLE payment_method (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount_paid NUMERIC(10, 2),
    proof_image TEXT,
    reference_number VARCHAR(255) NOT NULL
);

CREATE TABLE payment_verification (
    id SERIAL PRIMARY KEY,
    verification_date DATE NOT NULL,
    is_verified BOOLEAN NOT NULL
);

-- ORDER TRANSACTION
CREATE TABLE order_transaction (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(255) NOT NULL
);