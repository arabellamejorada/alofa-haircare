import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";
import {
  createCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getCartById,
  getCartByCustomerId,
} from "../api/cart";
import { AuthContext } from "./AuthContext";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(
    localStorage.getItem("guest_cart_id") || null,
  );
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const createGuestCart = async () => {
    try {
      const cart = await createCart(null); // Creates a guest cart
      localStorage.setItem("guest_cart_id", cart.cart_id); // Store guest cart ID
      setCartId(cart.cart_id);
      setCartItems([]); // Initialize empty cart items
    } catch (error) {
      console.error("Error creating guest cart:", error);
    }
  };

  const fetchCart = async () => {
    setLoading(true); // Set loading to true
    try {
      let fetchedCart;
      if (token) {
        console.log("token.customer_id: ", token.customer_id);
        fetchedCart = await getCartByCustomerId(token.customer_id);
      } else if (cartId) {
        fetchedCart = await getCartById(cartId);
      } else {
        await createGuestCart();
        setLoading(false);
        return;
      }

      // Set cart items and subtotal
      setCartItems(fetchedCart.items);
      setCartId(fetchedCart.cart.cart_id);
      calculateSubtotal(fetchedCart.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (product) => {
    console.log("product: ", product);
    try {
      // Ensure a cart ID exists (either guest or user)
      if (!cartId) {
        await createGuestCart();
      }

      const newItem = await addCartItem(cartId, product.id, 1);

      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.variation_id === product.id,
        );
        let updatedCartItems;

        if (existingItem) {
          // Update the quantity of the existing item
          updatedCartItems = prevItems.map((item) =>
            item.variation_id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  item_total: (item.quantity + 1) * item.unit_price,
                }
              : item,
          );
        } else {
          // Add the new item to the cart
          const newItem = {
            id: product.id,
            name: product.name,
            value: product.value,
            image: product.image,
            unit_price: product.price,
            quantity: 1,
            item_total: product.price,
            variation_id: product.id,
          };
          updatedCartItems = [...prevItems, newItem];
        }

        calculateSubtotal(updatedCartItems);
        return updatedCartItems;
      });

      // Call the backend to update the cart asynchronously
      await addCartItem(cartId, product.id, 1);

      // Show a success toast message
      if (product.value !== "N/A") {
        toast.success(`${product.name} ${product.value} added to cart!`);
      } else {
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  const handleQuantityChange = async (variation_id, quantity) => {
    const newQuantity = Math.max(1, Math.floor(Number(quantity)));

    if (!variation_id) {
      console.error("Variation ID is undefined or null.");
      toast.error("Cannot update item with undefined variation ID.");
      return;
    }

    try {
      // Call API to update the cart item
      const updatedItem = await updateCartItem(
        cartId,
        variation_id,
        newQuantity,
      );

      // Update cart state with the new item quantity and recalculate the item_total
      setCartItems((prevItems) => {
        const updatedCartItems = prevItems.map((item) =>
          item.variation_id === variation_id
            ? {
                ...item,
                quantity: updatedItem.quantity,
                item_total: updatedItem.quantity * item.unit_price,
              }
            : item,
        );
        calculateSubtotal(updatedCartItems);
        return updatedCartItems;
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast.error("Failed to update item quantity.");
    }
  };

  const handleDelete = async (variation_id) => {
    if (!variation_id) {
      console.error("Variation ID is undefined or null.");
      toast.error("Cannot delete item with undefined variation ID.");
      return;
    }

    console.log("Deleting item with variation_id: ", variation_id);
    try {
      await deleteCartItem(cartId, variation_id);

      // Update the cart state by removing the deleted item
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.variation_id !== variation_id),
      );

      const removedItem = cartItems.find(
        (item) => item.variation_id === variation_id,
      );

      calculateSubtotal(cartItems);

      // Show success toast
      if (removedItem) {
        if (removedItem.value !== "N/A") {
          toast.success(
            `${removedItem.name} ${removedItem.value} removed from cart!`,
          );
        } else {
          toast.success(`${removedItem.name} removed from cart!`);
        }
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const calculateSubtotal = (items) => {
    const newSubtotal = items.reduce((sum, item) => sum + item.item_total, 0);
    setSubtotal(newSubtotal);
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

      <CartContext.Provider
        value={{
          cartItems,
          setCartItems,
          cartId,
          setCartId,
          addToCart,
          handleQuantityChange,
          handleDelete,
          subtotal,
          loading,
        }}
      >
        {!loading && children} {/* Render children only after loading */}
      </CartContext.Provider>
    </div>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CartProvider };
