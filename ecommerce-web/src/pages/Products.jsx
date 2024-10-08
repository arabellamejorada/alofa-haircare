import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Filter from "../components/Filter"; // Ensure this import exists if Filter is a custom component
import { getAllProducts, getAllProductVariations } from "../api/product.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("none");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        const productVariantsData = await getAllProductVariations();

        console.log("Fetched Products Data:", productsData);
        console.log("Fetched Product Variants Data:", productVariantsData);

        setProducts(productsData);
        setProductVariants(productVariantsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Processed product data that combines product information with its variations
  const processedProductData = productVariants.map((variation) => {
    const product = products.find((p) => p.product_id === variation.product_id);

    // Extract the image filename if the variation has an image
    const imageName = variation.image?.split("/").pop();

    return {
      id: variation.variation_id,
      image: imageName
        ? `http://localhost:3001/uploads/${imageName}`
        : "/default-image.jpg",
      name: `${product?.name || "Unnamed Product"} ${variation.value}`,
      price: variation.unit_price || 0, // Ensure a fallback for the price
      category: product?.category || "Uncategorized",
    };
  });

  // Filter products by category
  let filteredProducts =
    selectedCategory === "All"
      ? processedProductData
      : processedProductData.filter(
          (product) => product.category === selectedCategory,
        );

  // Sort products by price if applicable
  if (selectedSort === "low-to-high") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "high-to-low") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen p-8 flex flex-col items-center">
      {/* Filter Component */}
      <Filter
        categories={["All", "Category1", "Category2"]} // Replace with actual category list
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-screen-xl">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
