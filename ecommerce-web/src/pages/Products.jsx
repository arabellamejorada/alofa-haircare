import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Filter from "../components/Filter/Filter.jsx";
import FilterButton from "../components/Filter/FilterButton.jsx";
import Search from "../components/Filter/Search.jsx";
import { ClipLoader } from "react-spinners";
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        const productVariantsData = await getAllProductVariations();
        const categoriesData = await getAllCategories();

        setProducts(productsData);
        setProductVariants(productVariantsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Effect for handling category change and clearing the search query
  useEffect(() => {
    // Reset the search query when a new category is selected
    if (selectedCategory !== "All") {
      setSearchQuery("");
    }

    // Trigger loading when switching categories or clearing the search
    if (selectedCategory !== "All" || searchQuery === "") {
      setLoading(true);

      setTimeout(() => {
        // Process product data and filter based on category
        const processedProductData = productVariants
          .filter(
            (variation) =>
              variation.status_description.toLowerCase() !== "archived",
          )
          .map((variation) => {
            const product = products.find(
              (p) => p.product_id === variation.product_id,
            );
            const imageName = variation.image
              ? variation.image.split("/").pop()
              : null;
            return {
              id: variation.variation_id,
              image: imageName
                ? `http://localhost:3001/uploads/${imageName}`
                : `https://via.placeholder.com/150?text=No+Image+Available`,
              name: `${product?.name || "Unnamed Product"}`,
              value: variation.value,
              price: parseFloat(variation.unit_price) || 0,
              category: variation.product_category || "Uncategorized",
              sku: variation.sku,
            };
          });

        // Filter products by selected category
        let updatedProducts =
          selectedCategory === "All"
            ? processedProductData
            : processedProductData.filter(
                (product) => product.category === selectedCategory,
              );

        // Sort the products by price
        if (selectedSort === "low-to-high") {
          updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
        } else if (selectedSort === "high-to-low") {
          updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(updatedProducts);
        setLoading(false);
      }, 500); // Add a delay to simulate loading time, if needed
    }
  }, [selectedCategory, selectedSort, productVariants, products]);

  // Separate effect for handling search without showing loading
  useEffect(() => {
    // Only filter by search if there is a search query and no loading
    if (searchQuery) {
      const filteredProducts = productVariants
        .filter(
          (variation) =>
            variation.status_description.toLowerCase() !== "archived",
        )
        .map((variation) => {
          const product = products.find(
            (p) => p.product_id === variation.product_id,
          );
          const imageName = variation.image
            ? variation.image.split("/").pop()
            : null;
          return {
            id: variation.variation_id,
            image: imageName
              ? `http://localhost:3001/uploads/${imageName}`
              : `https://via.placeholder.com/150?text=No+Image+Available`,
            name: `${product?.name || "Unnamed Product"}`,
            value: variation.value,
            price: parseFloat(variation.unit_price) || 0,
            category: variation.product_category || "Uncategorized",
            sku: variation.sku,
          };
        })
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.value.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      setFilteredProducts(filteredProducts);
    }
  }, [searchQuery, productVariants, products, loading]);

  return (
    <div className="relative">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

      <div
        className={`pt-32 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen p-8 flex flex-col items-center w-full overflow-x-hidden ${loading ? "opacity-50" : ""}`}
      >
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
              <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
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
              !loading && ( // Show this message only if loading is false
                <div className="flex items-center justify-center h-full text-gray-500">
                  Sorry, we couldn’t find any products for this filter.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
