import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { LiaPeopleCarrySolid } from "react-icons/lia";
import { MdOutlineCategory, MdOutlineDiscount } from "react-icons/md";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  /*{ 
		key: 'orders',
		label: 'Orders',
		path: '/orders',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'customers',
		label: 'Customers',
		path: '/customers',
		icon: <HiOutlineUsers />
	}, */
];

/* export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: <HiOutlineCog />,
  },
  {
    key: "support",
    label: "Help & Support",
    path: "/support",
    icon: <HiOutlineQuestionMarkCircle />,
  },
]; */

export const PRODUCT_SIDEBAR_LINKS = [
  {
    key: "product_list",
    label: "Product List",
    path: "/products",
    icon: <HiOutlineCube />,
  },
  {
    key: "product_categories",
    label: "Product Categories",
    path: "/productcategories",
    icon: <MdOutlineCategory />,
  },
];

export const VOUCHER_SIDEBAR_LINKS = [
  {
    key: "voucher",
    label: "Voucher",
    path: "/voucher",
    icon: <MdOutlineDiscount />,
  },
  {
    key: "faqs",
    label: "FAQs",
    path: "/faqs",
    icon: <HiOutlineQuestionMarkCircle />,
  },
];

export const INVENTORY_SIDEBAR_LINKS = [
  {
    key: "inventory",
    label: "Inventory",
    path: "/inventory",
    icon: <HiOutlineDocumentText />,
  },
  {
    key: "stock_in",
    label: "Stock In",
    path: "/stockin",
    icon: <FiTrendingUp />,
  },

  {
    key: "stock_out",
    label: "Stock Out",
    path: "/stockout",
    icon: <FiTrendingDown />,
  },
];

export const EMPLOYEE_SIDEBAR_LINKS = [
  {
    key: "suppliers",
    label: "Suppliers",
    path: "/suppliers",
    icon: <LiaPeopleCarrySolid />,
  },
  {
    key: "employees",
    label: "Employees",
    path: "/employees",
    icon: <HiOutlineUsers />,
  },
];
