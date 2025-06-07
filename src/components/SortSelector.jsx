function SortSelector({ sortField, setSortField, sortOrder, setSortOrder }) {
  return (
    <div className="text-center my-4">
      <label className="mr-2 font-semibold">Ordenar por:</label>
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        className="seleccion border border-gray-300 rounded px-3 py-1 mr-4"
      >
        <option value="price">Precio</option>
        <option value="rating">Rating</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
    </div>
  );
}

export default SortSelector;