
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
    <section className="texto-detailed-stats text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
            Estadísticas Detalladas
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
            <strong>Precio promedio:</strong> ${averagePrice.toFixed(2)} |{" "}
            <strong>Rating promedio:</strong> {averageRating.toFixed(2)} <br />
            <strong>Productos con stock &gt; 50:</strong> {highStockCount} |{" "}
            <strong>Productos con rating &gt; 4.5:</strong> {highRatingCount}
          </p>
        </div>

        <div className="flex flex-wrap -m-4">
          {Object.keys(productsByCategory).map((cat) => (
            <div key={cat} className="p-4 lg:w-1/4 sm:w-1/2 w-full">
              <h2 className="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">
                {cat}
              </h2>
              <nav className="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
                {[
                  {label: `Productos: ${productsByCategory[cat]}`,},
                  {label: `Precio promedio: $${averagePriceByCategory[cat]?.toFixed(2)}`,},
                  {label: `Rating promedio: ${averageRatingByCategory[cat]?.toFixed(2)}`,},
                  {label: `Más caro: ${extremesByCategory[cat]?.maxProduct} ($${extremesByCategory[cat]?.maxPrice})`,},
                  {label: `Más barato: ${extremesByCategory[cat]?.minProduct} ($${extremesByCategory[cat]?.minPrice})`,},
                ].map((item, idx) => (
                  <span key={idx} className="flex items-center text-sm">
                    <span className="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </span>
                    {item.label}
                  </span>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedStats;
