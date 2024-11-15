import { useContext } from "react";
import CartTable from "../components/CartTable.jsx";
import CartSummary from "../components/CartSummary.jsx";
import { CartContext } from "../components/CartContext.jsx";

const ShoppingCart = () => {
  const {
    cartItems,
    handleQuantityChange,
    handleDelete,
    handleDecrement,
    handleIncrement,
    subtotal,
    loading,
  } = useContext(CartContext);

  const total = subtotal; // can modify if included ang tax and all

  // Ensure the 'price' prop is mapped to 'unit_price'
  const processedCartItems = cartItems.map((item) => ({
    ...item,
    price: item.unit_price, // Map 'unit_price' to 'price'
  }));

  // Check if the cart is still loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading cart...</p> {/* Show a loading indicator */}
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center h-screen p-8 flex justify-center">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-5xl gap-4 pt-5">
        <div className="w-svw">
          {/* Pass cartItems, handleQuantityChange, and handleDelete to CartTable */}
          <CartTable
            cartItems={processedCartItems}
            handleQuantityChange={handleQuantityChange}
            handleDelete={handleDelete}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
          />
        </div>
        <div className="w-3/4">
          {/* Pass subtotal and total to CartSummary */}
          <CartSummary subtotal={subtotal} total={total} />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
