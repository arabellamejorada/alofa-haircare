import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Filter from "../components/Filter/Filter.jsx";
import FilterButton from "../components/Filter/FilterButton.jsx"; 
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
    const imageName = variation.image?.split("/").pop();

    return {
      id: variation.variation_id,
      image: imageName
        ? `http://localhost:3001/uploads/${imageName}`
        : "/default-image.jpg",
      name: `${product?.name || "Unnamed Product"} ${variation.value}`,
      price: parseFloat(variation.unit_price) || 0,
      category: product?.category || "Uncategorized",
    };
  });

  let filteredProducts =
    selectedCategory === "All"
      ? processedProductData
      : processedProductData.filter(
          (product) => product.category === selectedCategory,
        );

  if (selectedSort === "low-to-high") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "high-to-low") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
      <div className="pt-32 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen p-8 flex flex-col items-center w-full">
        
        {/* FilterButton in smaller viewports */}
        <div className="block lg:hidden mb-4 w-full">
          <FilterButton
            categories={["Hair Accessories", "Hair Tools", "Hair Products"]}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
          />
        </div>

        <div className="flex w-full max-w-screen-xl gap-8">
          {/* Filter Component on the left for larger viewports */}
          <div className="hidden lg:block w-1/4 mt-2">
            <Filter
              categories={["Hair Accessories", "Hair Tools", "Hair Products"]}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
            />
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4 h-[730px] overflow-y-auto overflow-x-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
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
        </div>
      </div>
  );
};

export default Products;
