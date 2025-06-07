import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#5dade2']; 

function Charts({ productsByCategory, allProducts }) {
  const barChartData = Object.keys(productsByCategory).map((category) => ({
    name: category,
    productos: productsByCategory[category],
  }));

  const lineChartData = [
    { month: 'Ene', precio: 600 },
    { month: 'Feb', precio: 33 },
    { month: 'Mar', precio: 250 },
    { month: 'Abr', precio: 80 },
    { month: 'May', precio: 250 },
  ];

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
    <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-pink-300 mb-20 mt-10">
      Visualizaciones
    </h1>

    <div className="flex flex-wrap justify-center gap-6">
      <div className="w-full md:w-1/3">
        <h2 className="barra text-gray-700 font-semibold mb-4 text-center">
          Productos por categoría
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="productos" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/3">
        <h2 className="lineas text-gray-700 font-semibold mb-4 text-center">
          Evolución de precios
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
      </div>

      <div className="w-full md:w-1/3">
        <h2 className="pie-chart text-gray-700 font-semibold mb-4 text-center">
          Proporción por stock
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
    </div>
  </div>
</section>
  );
}

export default Charts;
