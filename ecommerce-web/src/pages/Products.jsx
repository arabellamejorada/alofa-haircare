import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Filter from '../components/Filter.jsx';
import HairOil from '../../../productImages/hairoil_60ml.jpeg';
import HairClip from '../../../productImages/hairclips_all.jpeg';
import BambooBrush from '../../../productImages/tools_bamboobrush.jpeg';
import JadeComb from '../../../productImages/tools_jadecomb.jpeg';
import ScalpBrush from '../../../productImages/tools_scalpbrush.jpeg';
import '../../public/images/body-bg.png';

const products = [
  {
    id: 1,
    image: HairOil,
    name: 'All-Natural Hair Oil',
    category: 'Hair Oil',
    price: 622,
  },
  {
    id: 2,
    image: HairClip,
    name: 'Hair Clips',
    category: 'Hair Clips',
    price: 540,
  },
  {
    id: 3,
    image: BambooBrush,
    name: 'Bamboo Brush',
    category: 'Hair Brush',
    price: 380,
  },
  {
    id: 4,
    image: ScalpBrush,
    name: 'Scalp Brush',
    category: 'Hair Brush',
    price: 180,
  },
  {
    id: 5,
    image: JadeComb,
    name: 'Jade Comb',
    category: 'Hair Brush',
    price: 321.50,
  },
  {
    id: 6,
    image: HairOil,
    name: 'Hair Oil',
    category: 'Hair Oil',
    price: 450,
  },
  {
    id: 7,
    image: HairClip,
    name: 'Flower Hair Clip',
    category: 'Hair Clips',
    price: 350,
  },
  {
    id: 8,
    image: HairOil,
    name: 'Oil Hair',
    category: 'Hair Oil',
    price: 240,
  },
];

const categories = ['Hair Oil', 'Hair Brush', 'Hair Clips', 'Body mist', 'Stickers'];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('none');

  // Filter products by category
  let filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  // Sort products by price if applicable
  if (selectedSort === 'low-to-high') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'high-to-low') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center h-screen p-8 flex flex-col items-center">
      {/* Use the Filter component */}
      <Filter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-screen-xl">
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
  );
};

export default Products;
