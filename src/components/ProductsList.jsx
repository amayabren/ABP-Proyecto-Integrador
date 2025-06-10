function ProductsList({ products }) {
  return (
    <div className="p-6">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          {products.map((p) => (
            <div key={p.id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
              <div className="block relative h-48 rounded overflow-hidden">
                <img
                  alt="producto"
                  className="object-cover object-center w-full h-full block"
                  src={p.thumbnail}
                />
              </div>
              <div className="mt-4">
                <h2 className="text-gray-900 title-font text-lg font-medium">
                  {p.title}
                </h2>
                <p className="mt-1">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsList;
