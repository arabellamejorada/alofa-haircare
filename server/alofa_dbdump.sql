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
    session_id character varying(255),
    customer_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_activity timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    last_updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
-- Name: order_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_transaction (
    order_transaction_id integer NOT NULL,
    customer_id integer,
    total_amount numeric(10, 2) NOT NULL,
    date_ordered timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_status character varying(255) NOT NULL,
    reference_number character varying(255),
    payment_id integer NOT NULL,
    shipping_id integer NOT NULL
);
ALTER TABLE public.order_transaction OWNER TO postgres;
--
-- Name: order_transaction_order_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_transaction_order_transaction_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.order_transaction_order_transaction_id_seq OWNER TO postgres;
--
-- Name: order_transaction_order_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_transaction_order_transaction_id_seq OWNED BY public.order_transaction.order_transaction_id;
--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    amount_paid numeric(10, 2),
    proof_image text NOT NULL,
    payment_method_id integer NOT NULL,
    order_id integer NOT NULL
);
ALTER TABLE public.payment OWNER TO postgres;
--
-- Name: payment_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_method (
    payment_method_id integer NOT NULL,
    description character varying(255) NOT NULL
);
ALTER TABLE public.payment_method OWNER TO postgres;
--
-- Name: payment_method_payment_method_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_method_payment_method_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.payment_method_payment_method_id_seq OWNER TO postgres;
--
-- Name: payment_method_payment_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_method_payment_method_id_seq OWNED BY public.payment_method.payment_method_id;
--
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_payment_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.payment_payment_id_seq OWNER TO postgres;
--
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;
--
-- Name: payment_verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_verification (
    payment_verification_id integer NOT NULL,
    verification_date date NOT NULL,
    is_verified boolean NOT NULL,
    employee_id integer,
    payment_id integer NOT NULL
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
    product_status_id integer
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
    type character varying(255),
    value character varying(255),
    sku character varying(100),
    unit_price numeric(10, 2),
    product_status_id integer,
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
    stock_in_date date DEFAULT CURRENT_DATE
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
    order_transaction_id integer,
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
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
ALTER COLUMN cart_id
SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);
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
-- Name: order_transaction order_transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
ALTER COLUMN order_transaction_id
SET DEFAULT nextval(
        'public.order_transaction_order_transaction_id_seq'::regclass
    );
--
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
ALTER COLUMN payment_id
SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);
--
-- Name: payment_method payment_method_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
ALTER COLUMN payment_method_id
SET DEFAULT nextval(
        'public.payment_method_payment_method_id_seq'::regclass
    );
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
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (
    cart_id,
    session_id,
    customer_id,
    created_at,
    last_activity,
    status
)
FROM stdin;
\.--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (
    customer_id,
    first_name,
    last_name,
    email,
    contact_number,
    role_id
)
FROM stdin;
\.--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (
    employee_id,
    first_name,
    last_name,
    email,
    contact_number,
    role_id,
    status_id
)
FROM stdin;
2 Arabella Mejorada agmejorada @addu.edu.ph 09312312312 1 1 1 Cassey Gempesaw catgempesaw @addu.edu.ph 09221234123 2 2 4 Achilleus Castillo accastillo @gmail.com 09123123982 2 3 3 Anthony Tabudlong arjtabudlong @gmail.com 09228446273 1 3 \.--
-- Data for Name: employee_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_status (status_id, description)
FROM stdin;
1 Active 2 Inactive 3 Archived \.--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (
    inventory_id,
    stock_quantity,
    last_updated_date,
    variation_id
)
FROM stdin;
25 0 2024 -09 -19 14 :41 :19.142 + 08 29 23 15 2024 -09 -19 10 :58 :32.056 + 08 27 24 59 2024 -09 -19 14 :41 :19.139 + 08 28 21 -31 2024 -09 -18 16 :08 :21.143 + 08 25 22 -10 2024 -09 -18 16 :08 :21.143 + 08 26 19 -14 2024 -09 -18 16 :08 :21.138 + 08 23 20 2 2024 -09 -18 16 :08 :21.141 + 08 24 \.--
-- Data for Name: order_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_transaction (
    order_transaction_id,
    customer_id,
    total_amount,
    date_ordered,
    order_status,
    reference_number,
    payment_id,
    shipping_id
)
FROM stdin;
\.--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (
    payment_id,
    date,
    amount_paid,
    proof_image,
    payment_method_id,
    order_id
)
FROM stdin;
\.--
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_method (payment_method_id, description)
FROM stdin;
\.--
-- Data for Name: payment_verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_verification (
    payment_verification_id,
    verification_date,
    is_verified,
    employee_id,
    payment_id
)
FROM stdin;
\.--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (
    product_id,
    name,
    description,
    product_category_id,
    product_status_id
)
FROM stdin;
1 Flower Hair Clip Cute 2 2 4 Jade Comb Stimulate hair growth 3 4 2 Hair Oil Rosemary 1 3 3 Mini Flower Hair Clip Mini hair clip,
comes in pairs 2 1 5 Hair Mist Desc 1 1 \.--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (product_category_id, name)
FROM stdin;
2 Hair Accessories 4 Body Products 3 Hair Tools 1 Hair Products \.--
-- Data for Name: product_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_status (status_id, description)
FROM stdin;
1 Available 2 Out of Stock 3 Discontinued 4 Archived \.--
-- Data for Name: product_variation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variation (
    variation_id,
    product_id,
    type,
    value,
    sku,
    unit_price,
    product_status_id,
    image
)
FROM stdin;
23 1 Color Seaside FHC - SEAS -0001 199.00 1 public / uploads / untitled -1726646901031 -379276836.jpeg 24 1 Color Blossom FHC - BLOS -0001 189.00 1 public / uploads / untitled -1726646901034 -566618279.jpeg 25 1 Color Meadow FHC - MEAD -0001 199.00 1 public / uploads / untitled -1726646901034 -760109210.jpeg 26 1 Color Midnight FHC - MIDN -0001 189.00 1 public / uploads / untitled -1726646901035 -501807312.jpeg 27 3 Color Sunset MFH - SUNS -0003 199.98 4 public / uploads / untitled -1726714712013 -768143593.jpeg 28 2 Size 30mL OIL - 30ML -0002 199.00 1 public / uploads / untitled -1726728079113 -727812291.jpeg 29 2 Size 60mL OIL - 60ML -0002 199.00 1 public / uploads / untitled -1726728079119 -47955822.jpeg \.--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (role_id, name, description)
FROM stdin;
1 Admin Full access to all system features
and settings,
including user management,
system configuration,
and data oversight.2 Employee Limited access to specific system functionalities relevant to day - to - day tasks.Includes managing personal information,
viewing
and updating assigned tasks,
and accessing data pertinent to their role.3 Customer Access to personal account details,
order history,
and product browsing.Customers can place orders,
track their purchases,
and manage their personal information.\.--
-- Data for Name: shipping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping (
    shipping_id,
    shipping_date,
    shipping_fee,
    tracking_number,
    shipping_method_id,
    shipping_address_id
)
FROM stdin;
\.--
-- Data for Name: shipping_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_address (
    shipping_address_id,
    address_line,
    barangay,
    city,
    province,
    zip_code,
    customer_id
)
FROM stdin;
\.--
-- Data for Name: shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_method (shipping_method_id, courier, description)
FROM stdin;
\.--
-- Data for Name: stock_in; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_in (
    stock_in_id,
    reference_number,
    supplier_id,
    stock_in_date
)
FROM stdin;
8 REF -540851 2 2024 -09 -18 9 REF -383833 2 2024 -09 -19 10 REF -797877 1 2024 -09 -19 11 REF -705390 2 2024 -09 -19 12 REF -236627 2 2024 -09 -19 13 REF -769838 1 2024 -09 -19 14 REF -149717 2 2024 -09 -19 15 REF -847694 1 2024 -09 -19 16 REF -435023 2 2024 -09 -19 17 REF -522151 2 2024 -09 -19 18 REF -313349 1 2024 -09 -23 \.--
-- Data for Name: stock_in_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_in_items (
    stock_in_item_id,
    stock_in_id,
    variation_id,
    quantity
)
FROM stdin;
11 8 23 100 12 8 24 100 13 8 25 100 14 8 26 100 15 9 27 5 16 9 24 3 17 10 27 2 18 11 24 7 19 12 23 1 20 12 24 1 21 12 25 1 22 12 26 1 23 12 27 1 24 13 23 3 25 13 24 3 26 13 25 3 27 13 26 3 28 13 27 3 29 14 25 3 30 14 26 4 31 14 27 4 32 15 23 2 33 16 28 7 34 17 27 3 35 17 25 2 36 17 26 2 37 17 27 4 38 17 28 52 39 18 24 1 \.--
-- Data for Name: stock_out; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_out (
    stock_out_id,
    reference_number,
    stock_out_date,
    order_transaction_id,
    employee_id
)
FROM stdin;
5 ADJ20230918 2023 -09 -18 00 :00 :00 \ N \ N 7 ADJ20230917 2023 -09 -18 00 :00 :00 \ N \ N 8 ADJ20230915 2024 -09 -23 09 :22 :28.245978 \ N \ N 10 ADJ202309166 2024 -09 -23 01 :24 :08.623 \ N \ N 12 ADJ20230916 2024 -09 -23 01 :25 :20.429 \ N \ N 17 SO -1235 2024 -09 -23 01 :31 :14.469 \ N \ N \.--
-- Data for Name: stock_out_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_out_items (
    stock_out_item_id,
    stock_out_id,
    variation_id,
    quantity,
    reason
)
FROM stdin;
5 5 23 10 Damaged 6 5 24 5 Adjustment 7 7 25 10 Damaged 8 7 26 5 Adjustment 9 8 25 10 Damaged 10 8 26 5 Adjustment 11 10 25 10 Damaged 12 10 26 5 Adjustment 13 12 25 10 Damaged 14 12 26 5 Adjustment 15 17 23 10 Order 16 17 24 5 Order \.--
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier (
    supplier_id,
    supplier_name,
    contact_person,
    contact_number,
    email,
    address,
    status
)
FROM stdin;
2 XYZ Corp.Mr.John Doe 09228446273 supploer2 @gmail.com Manila Inactive 1 ABC Inc.Ms.Jane Doe 09228446273 supplier1 @gmail.com Davao Active \.--
-- Data for Name: user_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_account (
    user_account_id,
    username,
    password,
    date_created,
    employee_id,
    customer_id
)
FROM stdin;
1 catgempesaw $2b$10$rS.zo0L5qqlOJrf2ABqFieMj62IAN4jvrinvBK.PhUmG3kqLDknkO 2024 -09 -03 19 :45 :47.282035 1 \ N 2 agmejorada $2b$10$v4gflkdZhapRRwFrlZh9WuR2OtVfWA8dNOaF14JCJ9uNzR5IDzL.6 2024 -09 -03 19 :47 :08.633586 2 \ N 3 arjtabudlong $2b$10$MC2b8hTUC09xeTrdS1.VSOQHftI4AOJb7CiYDX3mzi2N0A86aE2U2 2024 -09 -03 20 :16 :27.580753 3 \ N 4 accastillo $2b$10$VMdxIhghQVpoP4OfNttqguwZKFGlh57aF4wa3PRlp7VvH8pkCJhLC 2024 -09 -07 20 :08 :36.410932 4 \ N \.--
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 1, false);
--
-- Name: customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_customer_id_seq', 1, false);
--
-- Name: employee_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_employee_id_seq', 4, true);
--
-- Name: employee_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_status_status_id_seq', 3, true);
--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_inventory_id_seq', 25, true);
--
-- Name: order_transaction_order_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.order_transaction_order_transaction_id_seq',
        3,
        true
    );
--
-- Name: payment_method_payment_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.payment_method_payment_method_id_seq',
        1,
        false
    );
--
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 1, false);
--
-- Name: payment_verification_payment_verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.payment_verification_payment_verification_id_seq',
        1,
        false
    );
--
-- Name: product_category_product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.product_category_product_category_id_seq',
        4,
        true
    );
--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_product_id_seq', 5, true);
--
-- Name: product_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_status_status_id_seq', 4, true);
--
-- Name: product_variation_variation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.product_variation_variation_id_seq',
        29,
        true
    );
--
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_role_id_seq', 3, true);
--
-- Name: shipping_address_shipping_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.shipping_address_shipping_address_id_seq',
        1,
        false
    );
--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.shipping_method_shipping_method_id_seq',
        1,
        false
    );
--
-- Name: shipping_shipping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_shipping_id_seq', 1, false);
--
-- Name: stock_in_items_stock_in_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.stock_in_items_stock_in_item_id_seq',
        39,
        true
    );
--
-- Name: stock_in_stock_in_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_in_stock_in_id_seq', 18, true);
--
-- Name: stock_out_items_stock_out_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.stock_out_items_stock_out_item_id_seq',
        16,
        true
    );
--
-- Name: stock_out_stock_out_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_out_stock_out_id_seq', 17, true);
--
-- Name: supplier_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_supplier_id_seq', 2, true);
--
-- Name: user_account_user_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        'public.user_account_user_account_id_seq',
        4,
        true
    );
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
-- Name: order_transaction order_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
ADD CONSTRAINT order_transaction_pkey PRIMARY KEY (order_transaction_id);
--
-- Name: order_transaction order_transaction_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
ADD CONSTRAINT order_transaction_reference_number_key UNIQUE (reference_number);
--
-- Name: payment_method payment_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
ADD CONSTRAINT payment_method_pkey PRIMARY KEY (payment_method_id);
--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);
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
-- Name: product_variation unique_sku; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variation
ADD CONSTRAINT unique_sku UNIQUE (sku);
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
-- Name: fki_fk_payment_verification_payment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_payment_verification_payment ON public.payment_verification USING btree (payment_id);
--
-- Name: cart cart_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
ADD CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
--
-- Name: customer fk_customer_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
ADD CONSTRAINT fk_customer_role FOREIGN KEY (role_id) REFERENCES public.role(role_id);
--
-- Name: employee fk_employee_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
ADD CONSTRAINT fk_employee_role FOREIGN KEY (role_id) REFERENCES public.role(role_id);
--
-- Name: employee fk_employee_status_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
ADD CONSTRAINT fk_employee_status_employee FOREIGN KEY (status_id) REFERENCES public.employee_status(status_id);
--
-- Name: payment_verification fk_payment_verification_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_verification
ADD CONSTRAINT fk_payment_verification_employee FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);
--
-- Name: product fk_product_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT fk_product_category FOREIGN KEY (product_category_id) REFERENCES public.product_category(product_category_id);
--
-- Name: shipping fk_shipping_address; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping
ADD CONSTRAINT fk_shipping_address FOREIGN KEY (shipping_address_id) REFERENCES public.shipping_address(shipping_address_id);
--
-- Name: shipping_address fk_shipping_address_customer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_address
ADD CONSTRAINT fk_shipping_address_customer FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
--
-- Name: shipping fk_shipping_method; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping
ADD CONSTRAINT fk_shipping_method FOREIGN KEY (shipping_method_id) REFERENCES public.shipping_method(shipping_method_id);
--
-- Name: user_account fk_user_account_customer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
ADD CONSTRAINT fk_user_account_customer FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
--
-- Name: user_account fk_user_account_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
ADD CONSTRAINT fk_user_account_employee FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);
--
-- Name: inventory inventory_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
ADD CONSTRAINT inventory_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.product_variation(variation_id) ON DELETE CASCADE;
--
-- Name: order_transaction order_transaction_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
ADD CONSTRAINT order_transaction_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
--
-- Name: order_transaction order_transaction_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
ADD CONSTRAINT order_transaction_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(payment_id);
--
-- Name: order_transaction order_transaction_shipping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
ADD CONSTRAINT order_transaction_shipping_id_fkey FOREIGN KEY (shipping_id) REFERENCES public.shipping(shipping_id);
--
-- Name: payment payment_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
ADD CONSTRAINT payment_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(payment_method_id);
--
-- Name: product product_product_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT product_product_status_id_fkey FOREIGN KEY (product_status_id) REFERENCES public.product_status(status_id) ON DELETE CASCADE;
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
-- Name: stock_out_items stock_out_items_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out_items
ADD CONSTRAINT stock_out_items_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.product_variation(variation_id);
--
-- Name: stock_out stock_out_order_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out
ADD CONSTRAINT stock_out_order_transaction_id_fkey FOREIGN KEY (order_transaction_id) REFERENCES public.order_transaction(order_transaction_id);
--
-- PostgreSQL database dump complete
--