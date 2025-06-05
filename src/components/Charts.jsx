import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#6366f1', '#34d399', '#f87171']; 

function Charts({ productsByCategory, allProducts }) {
  // Datos para el gráfico de barras
  const barChartData = Object.keys(productsByCategory).map((category) => ({
    name: category,
    productos: productsByCategory[category],
  }));

  // Datos simulados para gráfico de líneas (puede venir de la API más adelante)
  const lineChartData = [
    { month: 'Ene', precio: 300 },
    { month: 'Feb', precio: 350 },
    { month: 'Mar', precio: 280 },
    { month: 'Abr', precio: 320 },
    { month: 'May', precio: 310 },
  ];

  // Datos para Pie chart por stock
  const stockData = [
    {
      name: 'Alto stock (> 50)',
      value: allProducts.filter((p) => p.stock > 50).length,
    },
    {
      name: 'Stock medio (20-50)',
      value: allProducts.filter((p) => p.stock > 20 && p.stock <= 50).length,
    },
    {
      name: 'Bajo stock (≤ 20)',
      value: allProducts.filter((p) => p.stock <= 20).length,
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className='sm:text-3xl text-2xl font-medium text-center title-font text-pink-300 mb-10 '>Visualizaciones</h1>
        {/* Gráfico de barras */}
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Cantidad de productos por categoría
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="productos" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>

        {/* Gráfico de líneas */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-center">
          Evolución de precios simulada
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="precio" stroke="#34d399" />
          </LineChart>
        </ResponsiveContainer>

        {/* Pie chart */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-center">
          Proporción de productos según stock
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stockData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {stockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default Charts;
