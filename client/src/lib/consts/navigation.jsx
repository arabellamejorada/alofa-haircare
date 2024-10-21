import {
  HiOutlineViewGrid,
  HiOutlineCube,
  //HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineDocumentText,
  // HiOutlineAnnotation
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from "react-icons/hi";
import { LiaPeopleCarrySolid } from "react-icons/lia";
import { TbSitemap } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";
import { FiTruck, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { FaTruckLoading } from "react-icons/fa";

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

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
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
];

export const PRODUCT_SIDEBAR_LINKS = [
  {
    key: "product_list",
    label: "Product List",
    path: "/products",
    icon: <HiOutlineCube />,
  },
  // {
  //   key: "product_variations",
  //   label: "Product Variations",
  //   path: "/productvariations",
  //   icon: <TbSitemap />,
  // },
  {
    key: "product_categories",
    label: "Product Categories",
    path: "/productcategories",
    icon: <MdOutlineCategory />,
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

  {
    key: "suppliers",
    label: "Suppliers",
    path: "/suppliers",
    icon: <LiaPeopleCarrySolid />,
  },
];

export const EMPLOYEE_SIDEBAR_LINKS = [
  {
    key: "employees",
    label: "Employees",
    path: "/employees",
    icon: <HiOutlineUsers />,
  },
];
