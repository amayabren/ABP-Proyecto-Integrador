
function DetailedStats({
  averagePrice,
  productsByCategory,
  highStockCount,
  highRatingCount,
  averagePriceByCategory,
  extremesByCategory,
  averageRating,
  averageRatingByCategory
}) {
  return (
    <div className="bg-gray-100 p-6 my-6 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Estadísticas Detalladas</h2>

      <p className="mb-2"><strong>Precio promedio general:</strong> ${averagePrice.toFixed(2)}</p>
      <p className="mb-2"><strong>Promedio de rating general:</strong> {averageRating.toFixed(2)}</p>
      <p className="mb-2"><strong>Productos con stock &gt; 50:</strong> {highStockCount}</p>
      <p className="mb-4"><strong>Productos con rating &gt; 4.5:</strong> {highRatingCount}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Por categoría:</h3>
      <ul className="list-disc ml-6">
        {Object.keys(productsByCategory).map(cat => (
          <li key={cat}>
            <strong>{cat}:</strong> {productsByCategory[cat]} productos | 
            Promedio precio: ${averagePriceByCategory[cat].toFixed(2)} | 
            Promedio rating: {averageRatingByCategory[cat]?.toFixed(2)}
            <br />
            Más caro: {extremesByCategory[cat]?.maxProduct} (${extremesByCategory[cat]?.maxPrice})
            <br />
            Más barato: {extremesByCategory[cat]?.minProduct} (${extremesByCategory[cat]?.minPrice})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DetailedStats;
