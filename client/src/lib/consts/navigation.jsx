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

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "products",
    label: "Products",
    path: "/products",
    icon: <HiOutlineCube />,
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
  {
    key: "inventory",
    label: "Inventory",
    path: "/Inventory",
    icon: <HiOutlineDocumentText />,
  },
  {
    key: "employees",
    label: "Employees",
    path: "/employees",
    icon: <HiOutlineUsers />,
  },
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
