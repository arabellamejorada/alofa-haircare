CREATE DATABASE alofa;

\c alofa  -- Connect to the database (use this in psql)

-- USER MANAGEMENT
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    role_id INT REFERENCES role(id)
);

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    role_id INT REFERENCES role(id)
);

CREATE TABLE user_account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id INT REFERENCES employee(id),
    customer_id INT REFERENCES customer(id),
    -- Ensuring that each user account is associated with either an employee or a customer but not both
    CHECK ((employee_id IS NOT NULL AND customer_id IS NULL) OR (employee_id IS NULL AND customer_id IS NOT NULL))
);

-- SHIPPING 
CREATE TABLE shipping_address (
    id SERIAL PRIMARY KEY,
    address_line VARCHAR(255) NOT NULL,
    barangay VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    customer_id INT REFERENCES customer(id)
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
    tracking_number VARCHAR(255) NOT NULL,
    shipping_method_id INT REFERENCES shipping_method(id),
    shipping_address_id INT REFERENCES shipping_address(id)
);

-- PRODUCT
CREATE TABLE product_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    stock_quantity INTEGER NOT NULL,
    stock_in_date DATE NOT NULL,
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    status VARCHAR(255) NOT NULL,
    product_category_id INT REFERENCES product_category(id),
    inventory_id INT REFERENCES inventory(id)
);

CREATE TABLE product_order (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    product_id INT REFERENCES product(id)
);

-- PAYMENT
CREATE TABLE payment_method (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE payment_verification (
    id SERIAL PRIMARY KEY,
    verification_date DATE NOT NULL,
    is_verified BOOLEAN NOT NULL,
    employee_id INT REFERENCES employee(id),
    payment_id INT REFERENCES payment(id)
);

CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount_paid NUMERIC(10, 2),
    proof_image TEXT,
    reference_number VARCHAR(255) NOT NULL,
    payment_method_id INT REFERENCES payment_method(id),
    order_transaction_id INT REFERENCES order_transaction(id),
    payment_verification_id INT REFERENCES payment_verification(id)
);

-- ORDER TRANSACTION
CREATE TABLE order_transaction (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(255) NOT NULL,
    customer_id INT REFERENCES customer(id),
    product_order_id INT REFERENCES product_order(id),
    shipping_id INT REFERENCES shipping(id),
    payment_id INT REFERENCES payment(id)
);

ALTER TABLE inventory
ADD COLUMN product_id INT,
ADD COLUMN order_transaction_id INT;

ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_product
FOREIGN KEY (product_id)
REFERENCES product(id);

ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_order_transaction
FOREIGN KEY (order_transaction_id)
REFERENCES order_transaction(id);
