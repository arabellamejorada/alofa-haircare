import React from "react";
import { Link } from "react-router-dom";

const popularProductsData = [
  {
    id: "3432",
    product_name: 'Natural Hair Growth Oil"',
    product_thumbnail: "./photos/natural_hair_growth_oil.jpeg",
    product_price: "₱149.00",
    product_stock: 341,
  },
  {
    id: "7633",
    product_name: "Orchid Hair Clamp",
    product_thumbnail: "./photos/orchid_hair_clamp.jpeg",
    product_price: "₱99.00",
    product_stock: 24,
  },
  {
    id: "6534",
    product_name: "Personalized Bamboo Brush",
    product_thumbnail: "./photos/bamboo_brush.jpeg",
    product_price: "₱79.00",
    product_stock: 56,
  },
  {
    id: "9234",
    product_name: "Jade Comb",
    product_thumbnail: "./photos/jade_comb.jpeg",
    product_price: "₱199.00",
    product_stock: 98,
  },
  {
    id: "4314",
    product_name: "Scalp Massager",
    product_thumbnail: "./photos/scalp_massager.jpeg",
    product_price: "₱249.00",
    product_stock: 0,
  },
  {
    id: "4342",
    product_name: "Hair Mist",
    product_thumbnail: "./photos/hair_mist.jpeg",
    product_price: "₱199.00",
    product_stock: 453,
  },
];

function PopularProducts() {
  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border-gray-200 w-[20rem]">
      <strong className="text-gray-700 font-medium">Popular Products</strong>
      <div className="mt-4 flex flex-col gap-3">
        {popularProductsData.map((product) => (
          <Link
            to={`/product/${product.id}`}
            className="flex hover:no-underline"
          >
            <div className="w-10 h-10 min-w-10 bg-gray-200 rounded-sm overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={product.product_thumbnail}
                alt={product.product_name}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-800">{product.product_name}</p>
              <span
                className={`text-sm font-medium ${
                  product.product_stock === 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {product.product_stock === 0
                  ? `Out of Stock`
                  : product.product_stock + ` in stock`}
              </span>
            </div>
            <div className="text-xs text-gray-400 pl-2">
              {product.product_price}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PopularProducts;
