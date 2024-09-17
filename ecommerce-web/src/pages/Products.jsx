import ProductCard from '../components/ProductCard';
import HairOil from '../../../productImages/hairoil_60ml.jpeg'
import HairClip from '../../../productImages/hairclips_all.jpeg'
import BambooBrush from '../../../productImages/tools_bamboobrush.jpeg'
import JadeComb from '../../../productImages/tools_jadecomb.jpeg'
import ScalpBrush from '../../../productImages/tools_scalpbrush.jpeg'
import '../../public/images/body-bg.png'
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
    name: 'Hair Clips',
    price: 540,
  },
  {
    id: 3,
    image: BambooBrush,
    name: 'Bamboo Brush',
    price: 380,
  },
  {
    id: 4,
    image: ScalpBrush,
    name: 'Scalp Brush',
    price: 180,
  },
  {
    id: 5,
    image: JadeComb,
    name: 'Jade Comb',
    price: 321.50,
  },
  {
    id: 6,
    image: HairOil,
    name: 'Hair Oil',
    price: 450,
  },
  {
    id: 7,
    image: HairClip,
    name: 'Flower Hair Clip',
    price: 350,
  },
  {
    id: 8,
    image: HairOil,
    name: 'Oil Hair',
    price: 240,
  },
];

const Products = () => {
  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center h-screen p-8 flex justify-center">
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
