import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { getAllProducts, getAllProductVariations } from "../api/product.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

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

  const processedProductData = productVariants.map((variation) => {
    const product = products.find((p) => p.product_id === variation.product_id);

    // Extract just the file name if `variation.image` contains a path
    const imageName = variation.image?.split("/").pop();

    console.log("Matched Product for Variation:", product);
    console.log("Image Name:", imageName);

    return {
      id: variation.variation_id,
      image: imageName
        ? `http://localhost:3001/uploads/${imageName}`
        : "/default-image.jpg",
      name: `${product?.name || "Unnamed Product"} ${variation.value}`,
      price: variation.unit_price || 0, // Ensure a fallback for the price
    };
  });

  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center h-screen p-8 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-screen-xl">
        {processedProductData.map((product) => (
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
