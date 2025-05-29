function Stats(props) {
  return (
    <div className="fondo-stats text-center my-10 bg-cyan-100">
      <h1 className="fondo-h1-stats sm:text-3xl text-2xl font-medium title-font p-10 text-gray-900">
        Estadísticas
      </h1>

      <div className="flex text-center flex-wrap p-10">
        <div className="w-1/4 p-4">
          <div className="border-2 border-gray-300 px-4 py-6 rounded-lg">
            <h2 className="title-font font-medium text-3xl text-gray-900">${props.max}</h2>
            <p className="leading-relaxed">Producto más caro: {props.maxTitle}</p>
          </div>
        </div>

        <div className="w-1/4 p-4">
          <div className="border-2 border-gray-300 px-4 py-6 rounded-lg">
            <h2 className="title-font font-medium text-3xl text-gray-900">${props.min}</h2>
            <p className="leading-relaxed">Producto más barato: {props.minTitle}</p>
          </div>
        </div>

        <div className="w-1/4 p-4">
          <div className="border-2 border-gray-300 px-4 py-6 rounded-lg">
            <h2 className="title-font font-medium text-3xl text-gray-900">${props.totalPrice.toFixed(2)}</h2>
            <p className="leading-relaxed">Precio total de todos los productos filtrados</p>
          </div>
        </div>

        <div className="w-1/4 p-4">
          <div className="border-2 border-gray-300 px-4 py-6 rounded-lg">
            <h2 className="title-font font-medium text-3xl text-gray-900">{props.longTitle}</h2>
            <p className="leading-relaxed">Productos con título de más de 20 caracteres</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Stats;
