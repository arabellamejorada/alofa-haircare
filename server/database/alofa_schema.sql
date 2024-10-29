--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_table_access_method = heap;
--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    customer_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_activity timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying
);
ALTER TABLE public.cart OWNER TO postgres;
--
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_cart_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.cart_cart_id_seq OWNER TO postgres;
--
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;
--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    cart_item_id integer NOT NULL,
    cart_id integer NOT NULL,
    variation_id integer NOT NULL,
    quantity integer NOT NULL
);
ALTER TABLE public.cart_items OWNER TO postgres;
--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_cart_item_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNER TO postgres;
--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNED BY public.cart_items.cart_item_id;
--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    contact_number character varying(15) NOT NULL,
    role_id integer NOT NULL
);
ALTER TABLE public.customer OWNER TO postgres;
--
-- Name: customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_customer_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.customer_customer_id_seq OWNER TO postgres;
--
-- Name: customer_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_customer_id_seq OWNED BY public.customer.customer_id;
--
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    employee_id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    contact_number character varying(15) NOT NULL,
    role_id integer NOT NULL,
    status_id integer NOT NULL
);
ALTER TABLE public.employee OWNER TO postgres;
--
-- Name: employee_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_employee_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.employee_employee_id_seq OWNER TO postgres;
--
-- Name: employee_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_employee_id_seq OWNED BY public.employee.employee_id;
--
-- Name: employee_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_status (
    status_id integer NOT NULL,
    description character varying(50) NOT NULL
);
ALTER TABLE public.employee_status OWNER TO postgres;
--
-- Name: employee_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_status_status_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.employee_status_status_id_seq OWNER TO postgres;
--
-- Name: employee_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_status_status_id_seq OWNED BY public.employee_status.status_id;
--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    inventory_id integer NOT NULL,
    stock_quantity integer NOT NULL,
    last_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    variation_id integer
);
ALTER TABLE public.inventory OWNER TO postgres;
--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_inventory_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.inventory_inventory_id_seq OWNER TO postgres;
--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_inventory_id_seq OWNED BY public.inventory.inventory_id;
--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    order_item_id integer NOT NULL,
    order_id integer,
    variation_id integer,
    quantity integer,
    price numeric(10, 2)
);
ALTER TABLE public.order_items OWNER TO postgres;
--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_order_item_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.order_items_order_item_id_seq OWNER TO postgres;
--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.order_items.order_item_id;
--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    customer_id integer,
    total_amount numeric(10, 2),
    date_ordered timestamp with time zone DEFAULT now(),
    order_status character varying(255),
    payment_method character varying(255),
    payment_status character varying(255),
    proof_image text,
    shipping_id integer,
    subtotal numeric(10, 2),
    discount_amount numeric(10, 2),
    discount_code character varying(50)
);
ALTER TABLE public.orders OWNER TO postgres;
--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;
--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;
--
-- Name: payment_verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_verification (
    payment_verification_id integer NOT NULL,
    verification_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reference_number character varying(255) NOT NULL,
    is_verified boolean NOT NULL,
    employee_id integer NOT NULL,
    order_id integer NOT NULL
);
ALTER TABLE public.payment_verification OWNER TO postgres;
--
-- Name: payment_verification_payment_verification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_verification_payment_verification_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.payment_verification_payment_verification_id_seq OWNER TO postgres;
--
-- Name: payment_verification_payment_verification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_verification_payment_verification_id_seq OWNED BY public.payment_verification.payment_verification_id;
--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    product_category_id integer NOT NULL,
    product_status_id integer NOT NULL
);
ALTER TABLE public.product OWNER TO postgres;
--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    product_category_id integer NOT NULL,
    name character varying(255) NOT NULL
);
ALTER TABLE public.product_category OWNER TO postgres;
--
-- Name: product_category_product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_category_product_category_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.product_category_product_category_id_seq OWNER TO postgres;
--
-- Name: product_category_product_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_category_product_category_id_seq OWNED BY public.product_category.product_category_id;
--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_product_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.product_product_id_seq OWNER TO postgres;
--
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_product_id_seq OWNED BY public.product.product_id;
--
-- Name: product_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_status (
    status_id integer NOT NULL,
    description character varying(50) NOT NULL
);
ALTER TABLE public.product_status OWNER TO postgres;
--
-- Name: product_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_status_status_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.product_status_status_id_seq OWNER TO postgres;
--
-- Name: product_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_status_status_id_seq OWNED BY public.product_status.status_id;
--
-- Name: product_variation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variation (
    variation_id integer NOT NULL,
    product_id integer,
    product_status_id integer,
    type character varying(255),
    value character varying(255),
    unit_price numeric(10, 2),
    sku character varying(100),
    image text
);
ALTER TABLE public.product_variation OWNER TO postgres;
--
-- Name: product_variation_variation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variation_variation_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.product_variation_variation_id_seq OWNER TO postgres;
--
-- Name: product_variation_variation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variation_variation_id_seq OWNED BY public.product_variation.variation_id;
--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    role_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL
);
ALTER TABLE public.role OWNER TO postgres;
--
-- Name: role_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_role_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.role_role_id_seq OWNER TO postgres;
--
-- Name: role_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_role_id_seq OWNED BY public.role.role_id;
--
-- Name: shipping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping (
    shipping_id integer NOT NULL,
    shipping_date date NOT NULL,
    shipping_fee numeric(10, 2) NOT NULL,
    tracking_number character varying(255) NOT NULL,
    shipping_method_id integer NOT NULL,
    shipping_address_id integer NOT NULL
);
ALTER TABLE public.shipping OWNER TO postgres;
--
-- Name: shipping_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_address (
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    contact_number character varying(20) NOT NULL,
    email character varying(255) NOT NULL,
    shipping_address_id integer NOT NULL,
    address_line character varying(255) NOT NULL,
    barangay character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    province character varying(255) NOT NULL,
    zip_code character varying(255) NOT NULL,
    customer_id integer NOT NULL
);
ALTER TABLE public.shipping_address OWNER TO postgres;
--
-- Name: shipping_address_shipping_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipping_address_shipping_address_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.shipping_address_shipping_address_id_seq OWNER TO postgres;
--
-- Name: shipping_address_shipping_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipping_address_shipping_address_id_seq OWNED BY public.shipping_address.shipping_address_id;
--
-- Name: shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_method (
    shipping_method_id integer NOT NULL,
    courier character varying(255) NOT NULL,
    description character varying(255) NOT NULL
);
ALTER TABLE public.shipping_method OWNER TO postgres;
--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipping_method_shipping_method_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.shipping_method_shipping_method_id_seq OWNER TO postgres;
--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipping_method_shipping_method_id_seq OWNED BY public.shipping_method.shipping_method_id;
--
-- Name: shipping_shipping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipping_shipping_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.shipping_shipping_id_seq OWNER TO postgres;
--
-- Name: shipping_shipping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipping_shipping_id_seq OWNED BY public.shipping.shipping_id;
--
-- Name: stock_in; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_in (
    stock_in_id integer NOT NULL,
    reference_number character varying(255) NOT NULL,
    supplier_id integer,
    stock_in_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    employee_id integer
);
ALTER TABLE public.stock_in OWNER TO postgres;
--
-- Name: stock_in_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_in_items (
    stock_in_item_id integer NOT NULL,
    stock_in_id integer,
    variation_id integer,
    quantity integer NOT NULL
);
ALTER TABLE public.stock_in_items OWNER TO postgres;
--
-- Name: stock_in_items_stock_in_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_in_items_stock_in_item_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.stock_in_items_stock_in_item_id_seq OWNER TO postgres;
--
-- Name: stock_in_items_stock_in_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_in_items_stock_in_item_id_seq OWNED BY public.stock_in_items.stock_in_item_id;
--
-- Name: stock_in_stock_in_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_in_stock_in_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.stock_in_stock_in_id_seq OWNER TO postgres;
--
-- Name: stock_in_stock_in_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_in_stock_in_id_seq OWNED BY public.stock_in.stock_in_id;
--
-- Name: stock_out; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_out (
    stock_out_id integer NOT NULL,
    reference_number character varying(255),
    stock_out_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_id integer,
    employee_id integer
);
ALTER TABLE public.stock_out OWNER TO postgres;
--
-- Name: stock_out_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_out_items (
    stock_out_item_id integer NOT NULL,
    stock_out_id integer NOT NULL,
    variation_id integer NOT NULL,
    quantity integer NOT NULL,
    reason character varying(255) NOT NULL
);
ALTER TABLE public.stock_out_items OWNER TO postgres;
--
-- Name: stock_out_items_stock_out_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_out_items_stock_out_item_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.stock_out_items_stock_out_item_id_seq OWNER TO postgres;
--
-- Name: stock_out_items_stock_out_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_out_items_stock_out_item_id_seq OWNED BY public.stock_out_items.stock_out_item_id;
--
-- Name: stock_out_ref_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_out_ref_num_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.stock_out_ref_num_seq OWNER TO postgres;
--
-- Name: stock_out_stock_out_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_out_stock_out_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.stock_out_stock_out_id_seq OWNER TO postgres;
--
-- Name: stock_out_stock_out_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_out_stock_out_id_seq OWNED BY public.stock_out.stock_out_id;
--
-- Name: supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier (
    supplier_id integer NOT NULL,
    supplier_name character varying(255) NOT NULL,
    contact_person character varying(255) NOT NULL,
    contact_number character varying(15) NOT NULL,
    email character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'Pending'::character varying NOT NULL
);
ALTER TABLE public.supplier OWNER TO postgres;
--
-- Name: supplier_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_supplier_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.supplier_supplier_id_seq OWNER TO postgres;
--
-- Name: supplier_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_supplier_id_seq OWNED BY public.supplier.supplier_id;
--
-- Name: user_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account (
    user_account_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    employee_id integer,
    customer_id integer,
    CONSTRAINT user_account_check CHECK (
        (
            (
                (employee_id IS NOT NULL)
                AND (customer_id IS NULL)
            )
            OR (
                (employee_id IS NULL)
                AND (customer_id IS NOT NULL)
            )
        )
    )
);
ALTER TABLE public.user_account OWNER TO postgres;
--
-- Name: user_account_user_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_account_user_account_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_account_user_account_id_seq OWNER TO postgres;
--
-- Name: user_account_user_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_account_user_account_id_seq OWNED BY public.user_account.user_account_id;
--
-- Name: vouchers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vouchers (
    voucher_id integer NOT NULL,
    code character varying(50) NOT NULL,
    type character varying(10) NOT NULL,
    discount_value numeric(10, 2) NOT NULL,
    min_spend numeric(10, 2),
    max_discount numeric(10, 2),
    total_limit integer,
    max_use_per_user integer,
    current_uses integer DEFAULT 0,
    is_active boolean DEFAULT true,
    expiration_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT vouchers_type_check CHECK (
        (
            (type)::text = ANY (
                (
                    ARRAY ['flat'::character varying, 'percentage'::character varying]
                )::text []
            )
        )
    )
);
ALTER TABLE public.vouchers OWNER TO postgres;
--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vouchers_voucher_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.vouchers_voucher_id_seq OWNER TO postgres;
--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vouchers_voucher_id_seq OWNED BY public.vouchers.voucher_id;
--
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
ALTER COLUMN cart_id
SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);
--
-- Name: cart_items cart_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
ALTER COLUMN cart_item_id
SET DEFAULT nextval('public.cart_items_cart_item_id_seq'::regclass);
--
-- Name: customer customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
ALTER COLUMN customer_id
SET DEFAULT nextval('public.customer_customer_id_seq'::regclass);
--
-- Name: employee employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
ALTER COLUMN employee_id
SET DEFAULT nextval('public.employee_employee_id_seq'::regclass);
--
-- Name: employee_status status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_status
ALTER COLUMN status_id
SET DEFAULT nextval('public.employee_status_status_id_seq'::regclass);
--
-- Name: inventory inventory_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
ALTER COLUMN inventory_id
SET DEFAULT nextval('public.inventory_inventory_id_seq'::regclass);
--
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
ALTER COLUMN order_item_id
SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);
--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ALTER COLUMN order_id
SET DEFAULT nextval('public.orders_order_id_seq'::regclass);
--
-- Name: payment_verification payment_verification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_verification
ALTER COLUMN payment_verification_id
SET DEFAULT nextval(
        'public.payment_verification_payment_verification_id_seq'::regclass
    );
--
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ALTER COLUMN product_id
SET DEFAULT nextval('public.product_product_id_seq'::regclass);
--
-- Name: product_category product_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
ALTER COLUMN product_category_id
SET DEFAULT nextval(
        'public.product_category_product_category_id_seq'::regclass
    );
--
-- Name: product_status status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status
ALTER COLUMN status_id
SET DEFAULT nextval('public.product_status_status_id_seq'::regclass);
--
-- Name: product_variation variation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variation
ALTER COLUMN variation_id
SET DEFAULT nextval(
        'public.product_variation_variation_id_seq'::regclass
    );
--
-- Name: role role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
ALTER COLUMN role_id
SET DEFAULT nextval('public.role_role_id_seq'::regclass);
--
-- Name: shipping shipping_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping
ALTER COLUMN shipping_id
SET DEFAULT nextval('public.shipping_shipping_id_seq'::regclass);
--
-- Name: shipping_address shipping_address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_address
ALTER COLUMN shipping_address_id
SET DEFAULT nextval(
        'public.shipping_address_shipping_address_id_seq'::regclass
    );
--
-- Name: shipping_method shipping_method_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_method
ALTER COLUMN shipping_method_id
SET DEFAULT nextval(
        'public.shipping_method_shipping_method_id_seq'::regclass
    );
--
-- Name: stock_in stock_in_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in
ALTER COLUMN stock_in_id
SET DEFAULT nextval('public.stock_in_stock_in_id_seq'::regclass);
--
-- Name: stock_in_items stock_in_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in_items
ALTER COLUMN stock_in_item_id
SET DEFAULT nextval(
        'public.stock_in_items_stock_in_item_id_seq'::regclass
    );
--
-- Name: stock_out stock_out_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out
ALTER COLUMN stock_out_id
SET DEFAULT nextval('public.stock_out_stock_out_id_seq'::regclass);
--
-- Name: stock_out_items stock_out_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out_items
ALTER COLUMN stock_out_item_id
SET DEFAULT nextval(
        'public.stock_out_items_stock_out_item_id_seq'::regclass
    );
--
-- Name: supplier supplier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier
ALTER COLUMN supplier_id
SET DEFAULT nextval('public.supplier_supplier_id_seq'::regclass);
--
-- Name: user_account user_account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
ALTER COLUMN user_account_id
SET DEFAULT nextval(
        'public.user_account_user_account_id_seq'::regclass
    );
--
-- Name: vouchers voucher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
ALTER COLUMN voucher_id
SET DEFAULT nextval('public.vouchers_voucher_id_seq'::regclass);
--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id);
--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);
--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
ADD CONSTRAINT customer_pkey PRIMARY KEY (customer_id);
--
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
ADD CONSTRAINT employee_pkey PRIMARY KEY (employee_id);
--
-- Name: employee_status employee_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_status
ADD CONSTRAINT employee_status_pkey PRIMARY KEY (status_id);
--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
ADD CONSTRAINT inventory_pkey PRIMARY KEY (inventory_id);
--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);
--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
--
-- Name: payment_verification payment_verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_verification
ADD CONSTRAINT payment_verification_pkey PRIMARY KEY (payment_verification_id);
--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
ADD CONSTRAINT product_category_pkey PRIMARY KEY (product_category_id);
--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);
--
-- Name: product_status product_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status
ADD CONSTRAINT product_status_pkey PRIMARY KEY (status_id);
--
-- Name: product_variation product_variation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variation
ADD CONSTRAINT product_variation_pkey PRIMARY KEY (variation_id);
--
-- Name: product_variation product_variation_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variation
ADD CONSTRAINT product_variation_sku_key UNIQUE (sku);
--
-- Name: role role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
ADD CONSTRAINT role_name_key UNIQUE (name);
--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);
--
-- Name: shipping_address shipping_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_address
ADD CONSTRAINT shipping_address_pkey PRIMARY KEY (shipping_address_id);
--
-- Name: shipping_method shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_method
ADD CONSTRAINT shipping_method_pkey PRIMARY KEY (shipping_method_id);
--
-- Name: shipping shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping
ADD CONSTRAINT shipping_pkey PRIMARY KEY (shipping_id);
--
-- Name: stock_in_items stock_in_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in_items
ADD CONSTRAINT stock_in_items_pkey PRIMARY KEY (stock_in_item_id);
--
-- Name: stock_in stock_in_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in
ADD CONSTRAINT stock_in_pkey PRIMARY KEY (stock_in_id);
--
-- Name: stock_in stock_in_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in
ADD CONSTRAINT stock_in_reference_number_key UNIQUE (reference_number);
--
-- Name: stock_out_items stock_out_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out_items
ADD CONSTRAINT stock_out_items_pkey PRIMARY KEY (stock_out_item_id);
--
-- Name: stock_out stock_out_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out
ADD CONSTRAINT stock_out_pkey PRIMARY KEY (stock_out_id);
--
-- Name: stock_out stock_out_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out
ADD CONSTRAINT stock_out_reference_number_key UNIQUE (reference_number);
--
-- Name: supplier supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier
ADD CONSTRAINT supplier_pkey PRIMARY KEY (supplier_id);
--
-- Name: cart_items unique_cart_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT unique_cart_item UNIQUE (cart_id, variation_id);
--
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_account_id);
--
-- Name: user_account user_account_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
ADD CONSTRAINT user_account_username_key UNIQUE (username);
--
-- Name: vouchers vouchers_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
ADD CONSTRAINT vouchers_code_key UNIQUE (code);
--
-- Name: vouchers vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
ADD CONSTRAINT vouchers_pkey PRIMARY KEY (voucher_id);
--
-- Name: cart cart_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
ADD CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE
SET NULL;
--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id) ON DELETE CASCADE;
--
-- Name: cart_items cart_items_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
ADD CONSTRAINT cart_items_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.product_variation(variation_id) ON DELETE CASCADE;
--
-- Name: customer customer_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
ADD CONSTRAINT customer_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(role_id);
--
-- Name: employee employee_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
ADD CONSTRAINT employee_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(role_id);
--
-- Name: employee employee_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
ADD CONSTRAINT employee_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.employee_status(status_id);
--
-- Name: inventory inventory_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
ADD CONSTRAINT inventory_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.product_variation(variation_id);
--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
--
-- Name: payment_verification payment_verification_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_verification
ADD CONSTRAINT payment_verification_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id) ON DELETE CASCADE;
--
-- Name: payment_verification payment_verification_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_verification
ADD CONSTRAINT payment_verification_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
--
-- Name: product product_product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT product_product_category_id_fkey FOREIGN KEY (product_category_id) REFERENCES public.product_category(product_category_id);
--
-- Name: product product_product_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT product_product_status_id_fkey FOREIGN KEY (product_status_id) REFERENCES public.product_status(status_id);
--
-- Name: product_variation product_variation_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variation
ADD CONSTRAINT product_variation_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;
--
-- Name: product_variation product_variation_product_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variation
ADD CONSTRAINT product_variation_product_status_id_fkey FOREIGN KEY (product_status_id) REFERENCES public.product_status(status_id) ON DELETE CASCADE;
--
-- Name: shipping_address shipping_address_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_address
ADD CONSTRAINT shipping_address_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
--
-- Name: shipping shipping_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping
ADD CONSTRAINT shipping_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.shipping_address(shipping_address_id);
--
-- Name: shipping shipping_shipping_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping
ADD CONSTRAINT shipping_shipping_method_id_fkey FOREIGN KEY (shipping_method_id) REFERENCES public.shipping_method(shipping_method_id);
--
-- Name: stock_in stock_in_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in
ADD CONSTRAINT stock_in_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);
--
-- Name: stock_in_items stock_in_items_stock_in_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in_items
ADD CONSTRAINT stock_in_items_stock_in_id_fkey FOREIGN KEY (stock_in_id) REFERENCES public.stock_in(stock_in_id);
--
-- Name: stock_in_items stock_in_items_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in_items
ADD CONSTRAINT stock_in_items_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.product_variation(variation_id);
--
-- Name: stock_in stock_in_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in
ADD CONSTRAINT stock_in_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.supplier(supplier_id);
--
-- Name: stock_out stock_out_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out
ADD CONSTRAINT stock_out_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);
--
-- Name: stock_out_items stock_out_items_stock_out_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out_items
ADD CONSTRAINT stock_out_items_stock_out_id_fkey FOREIGN KEY (stock_out_id) REFERENCES public.stock_out(stock_out_id);
--
-- Name: stock_out stock_out_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out
ADD CONSTRAINT stock_out_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
--
-- Name: user_account user_account_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
ADD CONSTRAINT user_account_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
--
-- Name: user_account user_account_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
ADD CONSTRAINT user_account_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);
--
-- PostgreSQL database dump complete
--