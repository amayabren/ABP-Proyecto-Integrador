import ProductItem from './ProductItem';

function ProductsList({ products }) {
  return (
    <div className="fondo-producto bg-white">
      <div className="container px-5 mx-auto py-20">
        <div className="flex flex-wrap -m-4">
          {products.map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsList;
