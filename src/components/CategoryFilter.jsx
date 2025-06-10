function CategoryFilter({ categories, selectedCategory, onChange }) {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
      className="seleccion p-2 border rounded text-gray-700"
    >
      <option value="all">Todas las categorías</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
export default CategoryFilter;
