import { useState } from 'react';
import CartTable from '../components/CartTable.jsx';
import CartSummary from '../components/CartSummary.jsx';
import hairClips from '../../../productImages/hairclips_all.jpeg'
import hairOil from '../../../productImages/hairoil_60ml.jpeg'
import jadeComb from '../../../productImages/tools_jadecomb.jpeg'
import bamBrush from '../../../productImages/tools_bamboobrush.jpeg'
import scalpBrush from '../../../productImages/tools_scalpbrush.jpeg'

const ShoppingCart = () => {

  const [cartItems, setCartItems] = useState([
    {
      name: 'All Natural Hair-Oil',
      variation: '60 ml',
      price: 280.0,
      quantity: 1,
      imageUrl: hairOil,
    },
    {
      name: 'Hair Clips',
      variation: 'Blossom',
      price: 280.0,
      quantity: 1,
      imageUrl: hairClips,
    },
    {
        name: 'Jade Hair Brush',
        variation: 'White',
        price: 280.0,
        quantity: 1,
        imageUrl: jadeComb,
    },
    {
        name: 'Bamboo Hair Brush',
        variation: 'Brown',
        price: 280.0,
        quantity: 1,
        imageUrl: bamBrush,
    },
    {
        name: 'Scalp Brush',
        variation: 'White',
        price: 280.0,
        quantity: 1,
        imageUrl: scalpBrush,
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
