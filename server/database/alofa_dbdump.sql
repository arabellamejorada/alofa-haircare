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

CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.cart_items_cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.customer_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.employee_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.employee_status_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.inventory_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    price numeric(10,2)
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    total_amount numeric(10,2),
    date_ordered timestamp with time zone DEFAULT now(),
    order_status character varying(255),
    payment_method character varying(255),
    payment_status character varying(255),
    proof_image text,
    shipping_id integer,
    subtotal numeric(10,2),
    discount_amount numeric(10,2),
    discount_code character varying(50)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.payment_verification_payment_verification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.product_category_product_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_category_product_category_id_seq OWNER TO postgres;

--
-- Name: product_category_product_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_category_product_category_id_seq OWNED BY public.product_category.product_category_id;


--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.product_status_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    unit_price numeric(10,2),
    sku character varying(100),
    image text
);


ALTER TABLE public.product_variation OWNER TO postgres;

--
-- Name: product_variation_variation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variation_variation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.role_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    shipping_fee numeric(10,2) NOT NULL,
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

CREATE SEQUENCE public.shipping_address_shipping_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.shipping_method_shipping_method_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_method_shipping_method_id_seq OWNER TO postgres;

--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipping_method_shipping_method_id_seq OWNED BY public.shipping_method.shipping_method_id;


--
-- Name: shipping_shipping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipping_shipping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.stock_in_items_stock_in_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_in_items_stock_in_item_id_seq OWNER TO postgres;

--
-- Name: stock_in_items_stock_in_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_in_items_stock_in_item_id_seq OWNED BY public.stock_in_items.stock_in_item_id;


--
-- Name: stock_in_stock_in_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_in_stock_in_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.stock_out_items_stock_out_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_out_items_stock_out_item_id_seq OWNER TO postgres;

--
-- Name: stock_out_items_stock_out_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_out_items_stock_out_item_id_seq OWNED BY public.stock_out_items.stock_out_item_id;


--
-- Name: stock_out_ref_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_out_ref_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_out_ref_num_seq OWNER TO postgres;

--
-- Name: stock_out_stock_out_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_out_stock_out_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE public.supplier_supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    CONSTRAINT user_account_check CHECK ((((employee_id IS NOT NULL) AND (customer_id IS NULL)) OR ((employee_id IS NULL) AND (customer_id IS NOT NULL))))
);


ALTER TABLE public.user_account OWNER TO postgres;

--
-- Name: user_account_user_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_account_user_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    discount_value numeric(10,2) NOT NULL,
    min_spend numeric(10,2),
    max_discount numeric(10,2),
    total_limit integer,
    max_use_per_user integer,
    current_uses integer DEFAULT 0,
    is_active boolean DEFAULT true,
    expiration_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT vouchers_type_check CHECK (((type)::text = ANY ((ARRAY['flat'::character varying, 'percentage'::character varying])::text[])))
);


ALTER TABLE public.vouchers OWNER TO postgres;

--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vouchers_voucher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vouchers_voucher_id_seq OWNER TO postgres;

--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vouchers_voucher_id_seq OWNED BY public.vouchers.voucher_id;


--
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- Name: cart_items cart_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN cart_item_id SET DEFAULT nextval('public.cart_items_cart_item_id_seq'::regclass);


--
-- Name: customer customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer ALTER COLUMN customer_id SET DEFAULT nextval('public.customer_customer_id_seq'::regclass);


--
-- Name: employee employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee ALTER COLUMN employee_id SET DEFAULT nextval('public.employee_employee_id_seq'::regclass);


--
-- Name: employee_status status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_status ALTER COLUMN status_id SET DEFAULT nextval('public.employee_status_status_id_seq'::regclass);


--
-- Name: inventory inventory_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory ALTER COLUMN inventory_id SET DEFAULT nextval('public.inventory_inventory_id_seq'::regclass);


--
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: payment_verification payment_verification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_verification ALTER COLUMN payment_verification_id SET DEFAULT nextval('public.payment_verification_payment_verification_id_seq'::regclass);


--
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.product_product_id_seq'::regclass);


--
-- Name: product_category product_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category ALTER COLUMN product_category_id SET DEFAULT nextval('public.product_category_product_category_id_seq'::regclass);


--
-- Name: product_status status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status ALTER COLUMN status_id SET DEFAULT nextval('public.product_status_status_id_seq'::regclass);


--
-- Name: product_variation variation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variation ALTER COLUMN variation_id SET DEFAULT nextval('public.product_variation_variation_id_seq'::regclass);


--
-- Name: role role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN role_id SET DEFAULT nextval('public.role_role_id_seq'::regclass);


--
-- Name: shipping shipping_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping ALTER COLUMN shipping_id SET DEFAULT nextval('public.shipping_shipping_id_seq'::regclass);


--
-- Name: shipping_address shipping_address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_address ALTER COLUMN shipping_address_id SET DEFAULT nextval('public.shipping_address_shipping_address_id_seq'::regclass);


--
-- Name: shipping_method shipping_method_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_method ALTER COLUMN shipping_method_id SET DEFAULT nextval('public.shipping_method_shipping_method_id_seq'::regclass);


--
-- Name: stock_in stock_in_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in ALTER COLUMN stock_in_id SET DEFAULT nextval('public.stock_in_stock_in_id_seq'::regclass);


--
-- Name: stock_in_items stock_in_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_in_items ALTER COLUMN stock_in_item_id SET DEFAULT nextval('public.stock_in_items_stock_in_item_id_seq'::regclass);


--
-- Name: stock_out stock_out_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out ALTER COLUMN stock_out_id SET DEFAULT nextval('public.stock_out_stock_out_id_seq'::regclass);


--
-- Name: stock_out_items stock_out_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_out_items ALTER COLUMN stock_out_item_id SET DEFAULT nextval('public.stock_out_items_stock_out_item_id_seq'::regclass);


--
-- Name: supplier supplier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier ALTER COLUMN supplier_id SET DEFAULT nextval('public.supplier_supplier_id_seq'::regclass);


--
-- Name: user_account user_account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account ALTER COLUMN user_account_id SET DEFAULT nextval('public.user_account_user_account_id_seq'::regclass);


--
-- Name: vouchers voucher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers ALTER COLUMN voucher_id SET DEFAULT nextval('public.vouchers_voucher_id_seq'::regclass);


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (cart_id, customer_id, created_at, last_activity, status) FROM stdin;
3	\N	2024-10-27 17:05:00.301552+08	2024-10-27 17:07:10.748206+08	checked_out
5	2	2024-10-27 17:05:19.013607+08	2024-10-27 17:07:21.966639+08	checked_out
4	1	2024-10-27 17:05:15.865232+08	2024-10-27 17:07:15.790379+08	checked_out
9	1	2024-10-27 21:11:13.343671+08	2024-10-27 21:11:13.343671+08	checked_out
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (cart_item_id, cart_id, variation_id, quantity) FROM stdin;
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (customer_id, first_name, last_name, email, contact_number, role_id) FROM stdin;
1	Julio	Deluao	julio@gmail.com	09228883331	3
2	James	Carter	james@gmail.com	09228883221	3
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (employee_id, first_name, last_name, email, contact_number, role_id, status_id) FROM stdin;
1	Arabella	Mejorada	ara@gmail.com	09228446273	1	4
3	Anthony	Tabudlong	arjtabudlong@gmail.com	09123137484	2	4
4	John	Doe	jdoe@gmail.com	09882394857	2	4
9	Johny	Doe	jdoe@gmail.com	09882394858	2	1
11	Achilleus	Rodrigo	catgempesaw@gmail.com	09223445680	2	1
12	Arabella	Tabudlong	arssj@gmail.com	09882394857	1	1
13	John	Gempesaw	arjdasd@gmail.com	09882394857	2	1
8	Bella	Hadis	bellahadid@gmail.com	09882394857	1	1
10	Arabella	B	ab@gmail.com	09882394857	2	3
14	Cat	Meow	catmeow@gmail.com	09223442323	2	1
7	Olivia	Rodrigo	oliviarodrigo@gmail.com	09229990000	2	3
15	Arjed	Tabudlong	ara@gmail.com	09882394857	2	5
16	Cassey	Gempesaw	ara@gmail.com	09223445333	1	1
2	Cassey	Gempesaw	catgempesaw@gmail.com	09882394852	1	1
\.


--
-- Data for Name: employee_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_status (status_id, description) FROM stdin;
1	Active
2	Inactive
3	On Leave
4	Terminated
5	Archived
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (inventory_id, stock_quantity, last_updated_date, variation_id) FROM stdin;
3	100	2024-10-23 18:22:00	3
5	100	2024-10-23 18:22:00	5
6	100	2024-10-23 18:22:00	6
7	100	2024-10-23 18:22:00	7
8	100	2024-10-23 18:22:00	8
9	100	2024-10-23 18:22:00	9
10	100	2024-10-23 18:22:00	10
1	98	2024-10-23 23:07:13.110084	1
2	96	2024-10-23 23:10:33.163305	2
4	97	2024-10-23 23:27:47.262294	4
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (order_item_id, order_id, variation_id, quantity, price) FROM stdin;
1	2	1	1	380.00
2	2	2	2	380.00
3	3	6	3	180.00
4	3	8	1	180.00
5	3	2	2	380.00
6	4	4	2	180.00
7	7	8	2	180.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, customer_id, total_amount, date_ordered, order_status, payment_method, payment_status, proof_image, shipping_id, subtotal, discount_amount, discount_code) FROM stdin;
2	1	1140.00	2024-10-27 18:07:41.439863+08	pending	GCash	unpaid	\N	2	\N	\N	\N
3	1	1480.00	2024-10-27 18:07:58.586573+08	pending	GCash	unpaid	\N	2	\N	\N	\N
4	1	360.00	2024-10-27 18:08:04.545465+08	pending	GCash	unpaid	\N	2	\N	\N	\N
5	1	\N	2024-10-27 18:08:51.147102+08	pending	GCash	unpaid	\N	2	\N	\N	\N
6	1	\N	2024-10-27 18:09:08.629846+08	pending	GCash	unpaid	\N	2	\N	\N	\N
7	1	310.00	2024-10-27 21:29:54.438664+08	pending	Bank Transfer	unpaid	\N	2	360.00	50.00	FLAT50
\.


--
-- Data for Name: payment_verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_verification (payment_verification_id, verification_date, reference_number, is_verified, employee_id, order_id) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (product_id, name, description, product_category_id, product_status_id) FROM stdin;
2	Flower Hair Clip	Summer all year long with Alofa's Flower Hair Claw Clips!	1	1
1	Hair Oil	Alofa Natural Hair Growth Oil is Enriched with 8 natural oils formulated to repair and rejuvenate hair, leaving it smooth and silky. This blend of vitamins, minerals and antioxidants targets different concerns, making it suitable for all hair types.	3	1
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (product_category_id, name) FROM stdin;
3	Hair Products
1	Hair Accessories
2	Hair Tools
\.


--
-- Data for Name: product_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_status (status_id, description) FROM stdin;
1	Available
2	Out of Stock
3	Archived
\.


--
-- Data for Name: product_variation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variation (variation_id, product_id, product_status_id, type, value, unit_price, sku, image) FROM stdin;
3	2	1	Color	Sunrise	180.00	FHC-SUNR-0002	public/uploads/flower-hair-clip-sunrise-47.jpg
5	2	1	Color	Sunset	180.00	FHC-SUNS-0002	public/uploads/flower-hair-clip-sunrise-850.jpeg
6	2	1	Color	Midnight	180.00	FHC-MIDN-0002	public/uploads/flower-hair-clip-sunrise-102.jpeg
7	2	1	Color	Blossom	180.00	FHC-BLOS-0002	public/uploads/flower-hair-clip-sunrise-102.jpeg
8	2	1	Color	Meadow	180.00	FHC-MEAD-0002	public/uploads/flower-hair-clip-sunrise-835.jpeg
9	2	1	Color	Clementine	180.00	FHC-CLEM-0002	public/uploads/flower-hair-clip-sunrise-924.jpeg
10	2	1	Color	Lilac	180.00	FHC-LILA-0002	public/uploads/flower-hair-clip-sunrise-489.jpeg
1	1	\N	Size	30mL	380.00	OIL-30ML-0001	public/uploads/hair-oil-30ml-534.jpeg
2	1	1	Size	60mL	380.00	OIL-60ML-0001	public/uploads/hair-oil-30ml-785.jpeg
4	2	1	Color	Seaside	180.00	FHC-SEAS-0002	public/uploads/flower-hair-clip-sunrise-745.jpeg
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (role_id, name, description) FROM stdin;
1	Admin	System Administrator
2	Employee	Employee of the company
3	Customer	Customer of the company
\.


--
-- Data for Name: shipping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping (shipping_id, shipping_date, shipping_fee, tracking_number, shipping_method_id, shipping_address_id) FROM stdin;
\.


--
-- Data for Name: shipping_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_address (first_name, last_name, contact_number, email, shipping_address_id, address_line, barangay, city, province, zip_code, customer_id) FROM stdin;
\.


--
-- Data for Name: shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_method (shipping_method_id, courier, description) FROM stdin;
\.


--
-- Data for Name: stock_in; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_in (stock_in_id, reference_number, supplier_id, stock_in_date, employee_id) FROM stdin;
1	REF-845757	4	2024-10-23 18:22:00	2
\.


--
-- Data for Name: stock_in_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_in_items (stock_in_item_id, stock_in_id, variation_id, quantity) FROM stdin;
1	1	1	100
2	1	2	100
3	1	3	100
4	1	4	100
5	1	5	100
6	1	6	100
7	1	7	100
8	1	8	100
9	1	9	100
10	1	10	100
\.


--
-- Data for Name: stock_out; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_out (stock_out_id, reference_number, stock_out_date, order_id, employee_id) FROM stdin;
1	ADJ-20241023-48	2024-10-23 18:23:00	\N	2
\.


--
-- Data for Name: stock_out_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_out_items (stock_out_item_id, stock_out_id, variation_id, quantity, reason) FROM stdin;
1	1	1	2	Damaged
2	1	2	4	Damaged
3	1	4	3	Damaged
\.


--
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier (supplier_id, supplier_name, contact_person, contact_number, email, address, status) FROM stdin;
6	Supplier 3	Doutzen Kroes	09123333332	supplier3@gmail.com	New York, Matina Pangi	Pending
1	ABC Inc.	Ms. Jane Doe	09228446273	abcinc@gmail.co	Toril, Davao City	Active
4	Supplier 1	Anna Cole	09223333333	supplier1@gmail.com	Somewhere, Idk City	Active
2	XYZ Corp.	Mr. John Smith	09882394857	xyzcorp@gmail.com	Shenzhen Sorting Center, China	Pending
3	jdzvz	dsgfs	09228446273	supploer1@gmail.com	asdasd	Pending
5	Supplier 2	Mr. John Doesds	09212132323	supplier2@gmail.com	Toril, Davao City	Active
\.


--
-- Data for Name: user_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_account (user_account_id, username, password, date_created, employee_id, customer_id) FROM stdin;
1	aramejorada	$2b$10$PhheiYfHa2Rfw9.ca5SbY.j.ih28xoS.R7H6DP5sU.to4z9r9ONkm	2024-09-30 23:40:43.824667	1	\N
2	catgempesaw	$2b$10$vrjMT0zXT9DfchEpwihnQ.UcXmGp78EZB.mAHO.KOLR.kTlyWQ78y	2024-09-30 23:41:42.869801	2	\N
3	arjtabudlong	$2b$10$EyCctDdINIY9KeY0AW1ZF.a6foL/N.e0Nu5997LHADvT5tnkhuz2W	2024-09-30 23:44:19.521894	3	\N
4	jdoe	$2b$10$AbHyqmrgJ.hl.P5FNXCtMulXVzJVE2s/2HFeqZoB.UrSTEWozFWI2	2024-09-30 23:44:36.805566	4	\N
7	oliviarodrigo	$2b$10$Zf.arogMZTSAO251/WRjT.L3UJJ68l4qXu0UD2YLUYwx2iC58rDPu	2024-10-07 18:06:35.110919	7	\N
8	bellahadid	$2b$10$qUZnW7Zuf5hbHw.JtIgufe8hprcax.Hh7uq8eZ8TrmjY9cKZUT1DW	2024-10-11 18:24:10.880144	8	\N
9	johnnydoe	$2b$10$yIyVz5aalaPCYZp.DLs4mOaN.n/MIkgNoaprap2V64azMCMZ9mWli	2024-10-11 18:31:29.639239	9	\N
10	abcdef	$2b$10$qauj4mp3PoSPvmLLqW8zhO1rC/1sY6x.mixs0vG5JRcKAMl2nT17.	2024-10-11 18:37:50.083402	10	\N
11	acrrods	$2b$10$yVhFHKkXML.qEIoo8LH2XOHKU6j31q0b9IrRud2GJkZL/cN6pRHC2	2024-10-11 20:15:27.85391	11	\N
12	arjtabudlongsss	$2b$10$i1zGxuj1u6HB/0sQfJt3euUGk3MX9Hj1gMweKHwU9zrMu/Z5LNLle	2024-10-11 20:36:34.851624	12	\N
13	catgempesaw2	$2b$10$G.JslrzVYI58IQZ04ejiuO9IEgzZkf6bxB/RBdv3Nwuxv2Wh5o1Fu	2024-10-11 20:37:27.408935	13	\N
14	catmeow	$2b$10$GvwBeiWvnHc4jgrQ6SPzze8oYTfaJIG7LBSoV3RzCOfcFvoHAnVTi	2024-10-12 11:56:42.664793	14	\N
15	catgempesawss	$2b$10$rZvInuzAoK8XPVp5ImdNcet9jJ2fazt2VhS59fuYGH8ZvxDSgPKU2	2024-10-12 21:24:31.55064	15	\N
16	catgempesaww	$2b$10$iwVq3jH0OcsUIM.kCUgFtOPla7ffCMzRWtaAghF//VHTyvywkj0Ny	2024-10-16 22:32:50.853897	16	\N
\.


--
-- Data for Name: vouchers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vouchers (voucher_id, code, type, discount_value, min_spend, max_discount, total_limit, max_use_per_user, current_uses, is_active, expiration_date, created_at) FROM stdin;
1	DISCOUNT20	percentage	20.00	500.00	100.00	100	5	0	t	2024-12-31 00:00:00	2024-10-27 21:26:09.505606
3	WELCOME10	flat	10.00	\N	\N	\N	\N	0	t	\N	2024-10-27 21:26:09.547195
2	FLAT50	flat	50.00	\N	\N	50	3	1	t	2024-11-30 00:00:00	2024-10-27 21:26:09.528565
\.


--
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 9, true);


--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_cart_item_id_seq', 17, true);


--
-- Name: customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_customer_id_seq', 2, true);


--
-- Name: employee_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_employee_id_seq', 16, true);


--
-- Name: employee_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_status_status_id_seq', 5, true);


--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_inventory_id_seq', 10, true);


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 7, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 7, true);


--
-- Name: payment_verification_payment_verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_verification_payment_verification_id_seq', 1, false);


--
-- Name: product_category_product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_category_product_category_id_seq', 11, true);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_product_id_seq', 2, true);


--
-- Name: product_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_status_status_id_seq', 4, true);


--
-- Name: product_variation_variation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variation_variation_id_seq', 10, true);


--
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_role_id_seq', 3, true);


--
-- Name: shipping_address_shipping_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_address_shipping_address_id_seq', 1, false);


--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_method_shipping_method_id_seq', 1, false);


--
-- Name: shipping_shipping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_shipping_id_seq', 1, false);


--
-- Name: stock_in_items_stock_in_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_in_items_stock_in_item_id_seq', 10, true);


--
-- Name: stock_in_stock_in_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_in_stock_in_id_seq', 1, true);


--
-- Name: stock_out_items_stock_out_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_out_items_stock_out_item_id_seq', 3, true);


--
-- Name: stock_out_ref_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_out_ref_num_seq', 48, true);


--
-- Name: stock_out_stock_out_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_out_stock_out_id_seq', 1, true);


--
-- Name: supplier_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_supplier_id_seq', 6, true);


--
-- Name: user_account_user_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_account_user_account_id_seq', 16, true);


--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vouchers_voucher_id_seq', 3, true);


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
    ADD CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE SET NULL;


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

