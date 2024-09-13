
import ProductCard from './ProductCard'; // Ensure correct path
import HairOil from '../../../productImages/hairoil_60ml.jpeg'
import HairClip from '../../../productImages/hairclips_all.jpeg'
import BambooBrush from '../../../productImages/tools_bamboobrush.jpeg'

const products = [
  {
    id: 1,
    image: HairOil, // Replace with actual image paths
    name: 'All-Natural Hair Oil 60ml',
    price: 622,
  },
  {
    id: 2,
    image: HairClip,
    name: 'Hair Clip',
    price: 540,
  },
  {
    id: 3,
    image: BambooBrush,
    name: 'All-Natural Hair Oil 30ml',
    price: 380,
  },
  // Add more products here
];

const Products = () => {
  return (
    <div className="bg-body-bg bg-cover bg-center min-h-screen flex flex-wrap justify-evenly p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          image={product.image}
          name={product.name}
          price={product.price}
        />
      ))}
    </div>
  );
};

export default Products;
