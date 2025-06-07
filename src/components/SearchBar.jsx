function SearchBar({ search, setSearch, noResults }) {
  return (
    <div className="buscar-producto text-center">
      <input
        className="w-150 texto-search text-center rounded-full border-4 border-pink-100 text-gray-600 m-10"
        type="text"
        placeholder="Buscar producto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {noResults && (
        <div className="mb-10 text-gray-600">No se encontraron productos</div>
      )}
    </div>
  );
}

export default SearchBar;