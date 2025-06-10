function SortSelector({ sortBy, onChange }) {
  return (
    <select
      value={sortBy}
      onChange={(e) => onChange(e.target.value)} //onChange para que vaya cambiando el orden de acuerdo a lo que se elija
      className="seleccion p-2 border rounded text-gray-700"
    >
      <option value="none">Sin orden</option>{" "}
      {/* y el value son las opciones */}
      <option value="priceAsc">Precio: Menor a Mayor</option>
      <option value="priceDesc">Precio: Mayor a Menor</option>
      <option value="ratingAsc">Rating: Menor a Mayor</option>
      <option value="ratingDesc">Rating: Mayor a Menor</option>
    </select>
  );
}

export default SortSelector;
