function Pagination({ page, setPage, products }) {
  const limit = 30;

  return (
    <div className="flex justify-between w-1/3 mx-auto mb-10">
      <button
        className="border px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Página anterior
      </button>
      {/* Usamos el diabled para desabilitar el boton cuando la pag sea igual a 1. Cuando haga click, el setPage va a hacer que page reste 1*/}
      <h3 className="text-gray-700 font-semibold">{page}</h3>
      <button
        className="border px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={products.length < limit}
        onClick={() => setPage(page + 1)}
      >
        Página siguiente
      </button>
      {/* Acá es igual, se deshabilita cuanod la long de los productos sea menor a 30 y con cada click, page va a ir aumentando gracias al setPage */}
    </div>
  );
}

export default Pagination;
