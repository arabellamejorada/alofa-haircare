import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";
import {
  createCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getCartByCustomerId,
} from "../api/cart";
import { AuthContext } from "./AuthContext";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user, justLoggedIn, setJustLoggedIn } = useContext(AuthContext);
  const customerProfileId = user?.id; // Use 'user' instead of 'token'

  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage or empty array if not available
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [cartId, setCartId] = useState(
    sessionStorage.getItem("guest_cart_id") || null,
  );
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const updateCartContext = (newCartItems) => {
    setCartItems(newCartItems);
  };
  const createGuestCart = async () => {
    try {
      const cart = await createCart(null); // Creates a guest cart
      sessionStorage.setItem("guest_cart_id", cart.cart_id);
      setCartId(cart.cart_id);
      setCartItems([]);
      return cart;
    } catch (error) {
      console.error("Error creating guest cart:", error);
      throw error;
    }
  };

  const fetchCustomerCart = async () => {
    if (!customerProfileId) return; // Avoid fetching if customerProfileId is null

    setLoading(true);
    try {
      const fetchedCart = await getCartByCustomerId(customerProfileId);
      if (!fetchedCart) {
        throw new Error("No active cart found for customer.");
      }

      setCartId(fetchedCart.cart.cart_id);
      setCartItems(fetchedCart.items);
      calculateSubtotal(fetchedCart.items);
    } catch (error) {
      console.error("Error fetching customer cart:", error);
      toast.error("Failed to fetch customer cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (justLoggedIn && customerProfileId) {
      fetchCustomerCart();
      setJustLoggedIn(false); // Reset the flag after fetching
    }
  }, [justLoggedIn, customerProfileId]);

  // CartProvider component useEffect for initialization
  useEffect(() => {
    const savedCartId = localStorage.getItem("cartId");
    const savedCartItems = localStorage.getItem("cartItems");

    if (savedCartId) setCartId(savedCartId);
    if (savedCartItems) setCartItems(JSON.parse(savedCartItems));

    if (customerProfileId && !savedCartId) {
      // Fetch the user's cart if logged in and no saved cart ID
      fetchCustomerCart();
    }
  }, [customerProfileId]);

  const addToCart = async (product) => {
    try {
      // Check if cartId exists, if not, determine if we need to fetch or create a cart
      let currentCartId = cartId;

      if (!currentCartId) {
        if (customerProfileId) {
          // Fetch existing cart for logged-in user if cartId is missing
          const fetchedCart = await getCartByCustomerId(customerProfileId);
          if (fetchedCart) {
            currentCartId = fetchedCart.cart.cart_id;
            setCartId(currentCartId);
            setCartItems(fetchedCart.items);
            calculateSubtotal(fetchedCart.items);
          } else {
            throw new Error("No active cart found for customer.");
          }
        } else {
          // Create a guest cart if no user is logged in
          const createdCart = await createGuestCart();
          currentCartId = createdCart.cart_id;
          setCartId(currentCartId);
        }
      }
      const quantityToAdd = product.quantity || 1;
      const newItem = await addCartItem(
        currentCartId,
        product.id,
        quantityToAdd,
      );

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
                  quantity: item.quantity + quantityToAdd,
                  item_total: (item.quantity + quantityToAdd) * item.unit_price,
                }
              : item,
          );
        } else {
          // Add the new item to the cart
          const newCartItem = {
            cart_item_id: newItem.cart_item_id, // Use the ID from the database
            id: product.id,
            name: product.name,
            value: product.value,
            image: product.image,
            unit_price: product.price,
            quantity: quantityToAdd,
            item_total: product.price,
            variation_id: product.id,
          };
          updatedCartItems = [...prevItems, newCartItem];
        }

        calculateSubtotal(updatedCartItems);
        return updatedCartItems;
      });

      // Show a success toast message
      if (product.value !== "N/A" && product.value) {
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
      const updatedItem = await updateCartItem(
        cartId,
        variation_id,
        newQuantity,
      );

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

    try {
      await deleteCartItem(cartId, variation_id);

      setCartItems((prevItems) => {
        const updatedCartItems = prevItems.filter(
          (item) => item.variation_id !== variation_id,
        );

        // Update the subtotal after removing the item
        calculateSubtotal(updatedCartItems);

        return updatedCartItems;
      });

      const removedItem = cartItems.find(
        (item) => item.variation_id === variation_id,
      );

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

  // Reset the cart on logout
  const resetCart = async () => {
    setCartItems([]);
    setSubtotal(0);
    setCartId(null);
    localStorage.removeItem("cartId");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cart_subtotal");
    sessionStorage.removeItem("guest_cart_id");

    // Create a new guest cart after resetting
    try {
      await createGuestCart();
    } catch (error) {
      console.error("Error creating a new guest cart after logout:", error);
    }
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
          resetCart,
          fetchCustomerCart,
          updateCartContext,
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
