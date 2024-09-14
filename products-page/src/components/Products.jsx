import ProductCard from './ProductCard';
import HairOil from '../../../productImages/hairoil_60ml.jpeg'
import HairClip from '../../../productImages/hairclips_all.jpeg'
import BambooBrush from '../../../productImages/tools_bamboobrush.jpeg'
import JadeComb from '../../../productImages/tools_jadecomb.jpeg'
import ScalpBrush from '../../../productImages/tools_scalpbrush.jpeg'

const products = [
  {
    id: 1,
    image: HairOil,
    name: 'All-Natural Hair Oil',
    price: 622,
  },
  {
    id: 2,
    image: HairClip,
    name: 'Hair & Body Mist',
    price: 540,
  },
  {
    id: 3,
    image: BambooBrush,
    name: 'All-Natural Hair Oil',
    price: 380,
  },
  {
    id: 4,
    image: ScalpBrush,
    name: 'Flower Hair Clip',
    price: 180,
  },
  {
    id: 5,
    image: JadeComb,
    name: 'Flower Hair Clip',
    price: 180,
  },
  {
    id: 6,
    image: HairOil,
    name: 'Flower Hair Clip',
    price: 180,
  },
  {
    id: 7,
    image: HairClip,
    name: 'Flower Hair Clip',
    price: 180,
  },
  {
    id: 8,
    image: HairOil,
    name: 'Flower Hair Clip',
    price: 180,
  },
];

const Products = () => {
  return (
    <div className="pt-20 bg-red-50 bg-cover bg-center h-screen p-8 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-screen-xl">
        {products.map((product) => (
          <ProductCard
            key={product.id}
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
