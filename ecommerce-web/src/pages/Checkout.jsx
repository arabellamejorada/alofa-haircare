import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, subtotal, shippingCost, total } = useCart();

  return (
    <div className="flex">
      <div className="checkout-form p-4 w-1/2">
        <h2>Account:</h2>
        <input type="email" placeholder="Email" className="input" />
        
        <h2>Shipping Information:</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" className="input" />
          <input type="text" placeholder="Last Name" className="input" />
          <input type="text" placeholder="Address" className="input col-span-2" />
          <input type="text" placeholder="Barangay" className="input" />
          <input type="text" placeholder="City" className="input" />
          <input type="text" placeholder="Province" className="input" />
          <input type="text" placeholder="Postal Code" className="input" />
          <input type="text" placeholder="Phone" className="input col-span-2" />
        </div>
        
        <h2>Payment:</h2>
        <div className="payment-options flex gap-4">
          <label>
            <input type="radio" name="payment" value="GCash" />
            GCash
          </label>
          <label>
            <input type="radio" name="payment" value="Bank Transfer" />
            Bank Transfer
          </label>
        </div>
        
        <button className="complete-order-btn mt-4">COMPLETE ORDER</button>
      </div>
      
      <div className="order-summary p-4 w-1/2 bg-pink-100">
        <h2>Orders:</h2>
        <div className="order-items">
          {cartItems.map((item, index) => (
            <div key={index} className="order-item flex justify-between mb-2">
              <div className="item-details flex">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover mr-2" />
                <p>{item.quantity}x {item.name}</p>
              </div>
              <p>₱{item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <div className="order-totals mt-4">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>₱{subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping:</p>
            <p>₱{shippingCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total:</p>
            <p>₱{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
