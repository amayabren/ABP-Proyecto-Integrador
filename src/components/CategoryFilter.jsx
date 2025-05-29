function CategoryFilter({ selectedCategory, setSelectedCategory, categories }) {
  return (
    <div className="text-center my-4">
      <label className="mr-2 font-semibold">Filtrar por categoría:</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="all">Todas</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;