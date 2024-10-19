import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Filter from "../components/Filter/Filter.jsx";
import FilterButton from "../components/Filter/FilterButton.jsx";
import Search from "../components/Filter/Search.jsx";
import {
  getAllProducts,
  getAllProductVariations,
  getAllCategories,
} from "../api/product.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("none");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        const productVariantsData = await getAllProductVariations();
        const categoriesData = await getAllCategories();

        setProducts(productsData);
        setProductVariants(productVariantsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Process product data and filter based on category, search, and sort
    const processedProductData = productVariants
      .filter(
        (variation) =>
          variation.status_description.toLowerCase() !== "archived",
      )
      .map((variation) => {
        const product = products.find(
          (p) => p.product_id === variation.product_id,
        );
        const imageName = variation.image?.split("/").pop();
        // console.log("variation:", variation);
        return {
          id: variation.variation_id,
          image: imageName
            ? `http://localhost:3001/uploads/${imageName}`
            : "/default-image.jpg",
          name: `${product?.name || "Unnamed Product"}`,
          value: variation.value,
          price: parseFloat(variation.unit_price) || 0,
          category: variation.product_category || "Uncategorized",
          sku: variation.sku,
        };
      });

    // Filter products by category
    let updatedProducts =
      selectedCategory === "All"
        ? processedProductData
        : processedProductData.filter(
            (product) => product.category === selectedCategory,
          );

    // Filter by search query
    if (searchQuery) {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.value.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort the products by price
    if (selectedSort === "low-to-high") {
      updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "high-to-low") {
      updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, selectedCategory, selectedSort, productVariants, products]);

  return (
    <div className="pt-32 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen p-8 flex flex-col items-center w-full overflow-x-hidden">
      {/* Search and FilterButton in smaller viewports */}
      <div className="block lg:hidden mb-4 w-full gap-4 items-center">
        <div className="flex items-center w-full gap-2">
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <FilterButton
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />
      </div>

      <div className="flex w-full max-w-screen-xl gap-8">
        {/* Search and Filter Component on the left for larger viewports */}
        <div className="hidden lg:block w-1/4 mt-2">
          <div className="flex items-center w-full gap-2 mb-4">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          <Filter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
          />
        </div>

        {/* Products Grid */}
        <div className="w-full lg:w-full h-[730px] overflow-y-auto overflow-x-hidden">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0.5 gap-y-0.5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  value={product.value}
                  price={product.price}
                  sku={product.sku}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sorry, we couldn’t find any products for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
