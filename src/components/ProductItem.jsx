function ProductItem({ product }) {
  return (
    <div className="lg:w-1/4 md:w-1/2 p-4 w-full product-card">
      <div className="border border-pink-100 rounded-md shadow-sm p-4 h-full flex flex-col items-center">
          <div className="block relative h-48 w-full rounded overflow-hidden mb-4">
          <img
            alt={product.title}
            className="object-cover object-center w-full h-full"
            src={product.thumbnail}
          />
        </div>
        <h2 className="texto-productos text-gray-900 text-lg font-medium text-center">{product.title}</h2>
        <p className="texto-precios mt-1 text-center text-gray-700">${product.price}</p>
      </div>
    </div>
  );
}

export default ProductItem;