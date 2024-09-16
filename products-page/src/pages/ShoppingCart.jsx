import { useState } from 'react';
import CartTable from '../components/CartTable.jsx';
import CartSummary from '../components/CartSummary.jsx';


const ShoppingCart = () => {

  const [cartItems, setCartItems] = useState([
    {
      name: 'All Natural Hair-Oil',
      variation: '60 ml',
      price: 280.0,
      quantity: 1,
      imageUrl: '../../../productImages/hairoil_60ml.jpeg',
    },
    {
      name: 'Jade Hair Brush',
      variation: '60 ml',
      price: 280.0,
      quantity: 1,
      imageUrl: '../../../productImages/tools_jadecomb.jpeg',
    },
    {
        name: 'Jade Hair Brush',
        variation: '60 ml',
        price: 280.0,
        quantity: 1,
        imageUrl: '../../../productImages/tools_jadecomb.jpeg',
    },
    {
        name: 'Jade Hair Brush',
        variation: '60 ml',
        price: 280.0,
        quantity: 1,
        imageUrl: '../../../productImages/tools_jadecomb.jpeg',
    },
    {
        name: 'Jade Hair Brush',
        variation: '60 ml',
        price: 280.0,
        quantity: 1,
        imageUrl: '../../../productImages/tools_jadecomb.jpeg',
    },
  ]);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCartItems = cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: Number(newQuantity) };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleDelete = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal; // You can add tax or shipping to total here if needed

  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center h-screen p-8 flex justify-center">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-5xl">
        <div className="w-full lg:w-2/3 max-w-4xl">
            <CartTable cartItems={cartItems} handleQuantityChange={handleQuantityChange} handleDelete={handleDelete}/>
        </div>
        <div className="w-full lg:w-1/3 max-w-xs">
            <CartSummary subtotal={subtotal} total={total} />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
