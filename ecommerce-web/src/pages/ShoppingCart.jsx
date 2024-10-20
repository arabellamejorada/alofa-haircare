import { useContext } from "react";
import CartTable from "../components/CartTable.jsx";
import CartSummary from "../components/CartSummary.jsx";
import { CartContext } from "../components/CartContext.jsx";

const ShoppingCart = () => {
  
  const { cartItems, handleQuantityChange, handleDelete, subtotal } = useContext(CartContext);


  const total = subtotal; // can modify if included ang tax and all

  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center h-screen p-8 flex justify-center">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-5xl gap-4 pt-5">
        <div className="w-svw">
          {/* Pass cartItems, handleQuantityChange, and handleDelete to CartTable */}
          <CartTable
            cartItems={cartItems}
            handleQuantityChange={handleQuantityChange}
            handleDelete={handleDelete}
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
