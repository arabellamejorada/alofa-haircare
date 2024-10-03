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
--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (role_id, name, description)
FROM stdin;
1 Admin System Administrator 2 Employee Employee of the company 3 Customer Customer of the company \.--
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
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (cart_item_id, cart_id, variation_id, quantity)
FROM stdin;
\.--
-- Data for Name: employee_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_status (status_id, description)
FROM stdin;
1 Active 2 Inactive 3 On Leave 4 Terminated \.--
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
1 Arabella Mejorada ara @gmail.com 09228446273 1 1 2 Cassey Gempesaw catgempesaw @gmail.com 09882394857 1 1 3 Anthony Tabudlong arjtabudlong @gmail.com 09123137484 1 1 4 John Doe jdoe @gmail.com 09882394857 2 1 \.--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (product_category_id, name)
FROM stdin;
1 Hair Accessories 2 Hair Tools 3 Hair Products \.--
-- Data for Name: product_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_status (status_id, description)
FROM stdin;
1 Available 2 Out of Stock 3 Discontinued 4 Archived \.--
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
1 Hair Oil Alofa Natural Hair Growth Oil is Enriched with 8 natural oils formulated to repair
and rejuvenate hair,
leaving it smooth
and silky.This blend of vitamins,
minerals
and antioxidants targets different concerns,
making it suitable for all hair types.3 1 2 Flower Hair Clip Summer all year long with Alofa '' s Flower Hair Claw Clips,
1 1 3 Orchid Hair Clamp The summer accessory ! Our new
and improved Orchid Flower Clamp that comes in a various of shades.1 1 4 Scalp Massager & Scalp Brush Gently massage the scalp to promote blood flow
and circulation.Improve scalp health
and grow hair faster while enjoying the relaxing feeling ! \ nCan be used in the shower to further cleanse the scalp 2 1 --
-- Data for Name: product_variation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variation (
    variation_id,
    product_id,
    product_status_id,
    type,
    value,
    unit_price,
    sku,
    image
)
FROM stdin;
1 1 1 Size 30mL 380.00 OIL - 30ML -0001 public / uploads / untitled -1727711503720 -876289673.jpeg 2 1 1 Size 60mL 622.00 OIL - 60ML -0001 public / uploads / untitled -1727711503729 -422764022.jpeg 3 2 1 Color Sunset 180.00 FHC - SUNS -0002 public / uploads / untitled -1727711553604 -271075819.jpeg 4 2 1 Color Clementine 180.00 FHC - CLEM -0002 public / uploads / untitled -1727711553605 -911986321.jpeg 5 3 1 Color Pink 199.00 OHC - PINK -0003 public / uploads / untitled -1727711580887 -411640974.jpeg 6 4 1 280.00 SCA -0000 -0004 public / uploads / untitled -1727711601257 -54134435.jpeg \.--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (
    inventory_id,
    stock_quantity,
    last_updated_date,
    variation_id
)
FROM stdin;
3 0 2024 -09 -30 23 :52 :33.649 3 4 0 2024 -09 -30 23 :52 :33.652 4 1 276 2024 -09 -30 15 :57 :40.076 1 2 270 2024 -09 -30 23 :59 :00 2 5 190 2024 -10 -01 00 :07 :00 5 6 189 2024 -10 -01 00 :07 :00 6 \.--
-- Data for Name: shipping_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_address (
    first_name,
    last_name,
    contact_number,
    email,
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
-- Data for Name: order_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_transaction (
    order_transaction_id,
    customer_id,
    cart_id,
    total_amount,
    date_ordered,
    order_status,
    payment_method,
    payment_status,
    proof_image,
    is_verified,
    shipping_id
)
FROM stdin;
\.--
-- Data for Name: payment_verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_verification (
    payment_verification_id,
    verification_date,
    reference_number,
    is_verified,
    employee_id,
    order_transaction_id
)
FROM stdin;
\.--
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
1 ABC Inc.Ms.Jane Doe 09228446273 abcinc @gmail.com Toril,
Davao City 2 XYZ Corp.Mr.John Smith 09882394857 xyzcorp @gmail.com Shenzhen Sorting Center,
China \.--
-- Data for Name: stock_in; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_in (
    stock_in_id,
    reference_number,
    supplier_id,
    stock_in_date,
    employee_id
)
FROM stdin;
1 REF -744164 2 2024 -09 -30 23 :57 :00 2 2 REF -621943 2 2024 -09 -30 23 :59 :00 4 3 REF -114826 1 2024 -10 -01 00 :07 :00 2 \.--
-- Data for Name: stock_in_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_in_items (
    stock_in_item_id,
    stock_in_id,
    variation_id,
    quantity
)
FROM stdin;
1 1 1 1 2 2 2 190 3 3 5 200 4 3 6 150 \.--
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
1 ADJ -20240930 -21 2024 -09 -30 23 :56 :00 \ N 2 2 ADJ -20241001 -22 2024 -10 -01 00 :00 :00 \ N 1 3 ADJ -20241001 -23 2024 -10 -01 00 :07 :00 \ N 2 \.--
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
1 1 1 5 Damaged 2 2 2 20 Giveaway 3 3 5 10 Damage 4 3 6 11 Stock in error \.--
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
1 aramejorada $2b$10$PhheiYfHa2Rfw9.ca5SbY.j.ih28xoS.R7H6DP5sU.to4z9r9ONkm 2024 -09 -30 23 :40 :43.824667 1 \ N 2 catgempesaw $2b$10$vrjMT0zXT9DfchEpwihnQ.UcXmGp78EZB.mAHO.KOLR.kTlyWQ78y 2024 -09 -30 23 :41 :42.869801 2 \ N 3 arjtabudlong $2b$10$EyCctDdINIY9KeY0AW1ZF.a6foL / N.e0Nu5997LHADvT5tnkhuz2W 2024 -09 -30 23 :44 :19.521894 3 \ N 4 jdoe $2b$10$AbHyqmrgJ.hl.P5FNXCtMulXVzJVE2s / 2HFeqZoB.UrSTEWozFWI2 2024 -09 -30 23 :44 :36.805566 4 \ N \.--
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.cart_cart_id_seq ', 1, false);
--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.cart_items_cart_item_id_seq ', 1, false);
--
-- Name: customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.customer_customer_id_seq ', 1, false);
--
-- Name: employee_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.employee_employee_id_seq ', 4, true);
--
-- Name: employee_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.employee_status_status_id_seq ',
        4,
        true
    );
--
-- Name: inventory_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.inventory_inventory_id_seq ', 6, true);
--
-- Name: order_transaction_order_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.order_transaction_order_transaction_id_seq ',
        1,
        false
    );
--
-- Name: payment_verification_payment_verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.payment_verification_payment_verification_id_seq ',
        1,
        false
    );
--
-- Name: product_category_product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.product_category_product_category_id_seq ',
        3,
        true
    );
--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.product_product_id_seq ', 4, true);
--
-- Name: product_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.product_status_status_id_seq ', 4, true);
--
-- Name: product_variation_variation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.product_variation_variation_id_seq ',
        6,
        true
    );
--
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.role_role_id_seq ', 3, true);
--
-- Name: shipping_address_shipping_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.shipping_address_shipping_address_id_seq ',
        1,
        false
    );
--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.shipping_method_shipping_method_id_seq ',
        1,
        false
    );
--
-- Name: shipping_shipping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.shipping_shipping_id_seq ', 1, false);
--
-- Name: stock_in_items_stock_in_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.stock_in_items_stock_in_item_id_seq ',
        4,
        true
    );
--
-- Name: stock_in_stock_in_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.stock_in_stock_in_id_seq ', 3, true);
--
-- Name: stock_out_items_stock_out_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.stock_out_items_stock_out_item_id_seq ',
        4,
        true
    );
--
-- Name: stock_out_ref_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.stock_out_ref_num_seq ', 23, true);
--
-- Name: stock_out_stock_out_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.stock_out_stock_out_id_seq ', 3, true);
--
-- Name: supplier_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(' public.supplier_supplier_id_seq ', 2, true);
--
-- Name: user_account_user_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval(
        ' public.user_account_user_account_id_seq ',
        4,
        true
    );
--
-- PostgreSQL database dump complete