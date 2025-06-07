import './App.css'
import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import ProductsList from './components/ProductsList'
import Stats from './components/StatsPanel';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import SortSelector from './components/SortSelector';
import DetailedStats from './components/DetailedStats';
import Charts from './components/Charts';


function App() {
    //Estados
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [sortField, setSortField] = useState("price");
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState(1); //ponemos 1 porque empieza en la pag 1
    const [format, setFormat] = useState(""); //selección del formato para la exportación

    const limit = 30;

    useEffect(() => {
      axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}`).then((res) => {
        setProducts(res.data.products);
        const allCategories = [...new Set(res.data.products.map(p => p.category))];
        setCategories(allCategories);
      });
    }, [page]);


    const containerRef = useRef(null);

    //Filtra los productos
    const filteredProducts = products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    //Ordenamiento de los productos
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] - b[sortField];
      } else {
        return b[sortField] - a[sortField];
      }
    });

    //---------------------------Estadísticas-------------------------------------
    //Muestra el título del producto más caro
    const maxPrice = Math.max(...filteredProducts.map(p => p.price));
    const maxProduct = filteredProducts.find(p => p.price === maxPrice);
    const maxTitle = maxProduct?.title || "";
    //Muestra el título del producto más barato
    const minPrice = Math.min(...filteredProducts.map(p => p.price));
    const minProductObj = filteredProducts.find(p => p.price === minPrice);
    const minTitle = minProductObj?.title || "";
    //Calcula el precio total
    const totalPrice = filteredProducts.reduce((sum, p) => sum + p.price, 0);
    //Agarra los productos con más de 20 caracteres
    const longTitle = filteredProducts.filter(p => p.title.length > 20).length;

    //-------------------- Nuevas estadísticas detalladas ------------------------
    // Precio promedio general
    const averagePrice = filteredProducts.length > 0
      ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length
      : 0;

    // Cantidad de productos por categoría
    const productsByCategory = {};
    filteredProducts.forEach(p => {
      productsByCategory[p.category] = (productsByCategory[p.category] || 0) + 1;
    });

    // Stock > 50 y rating > 4.5
    const highStockCount = filteredProducts.filter(p => p.stock > 50).length;
    const highRatingCount = filteredProducts.filter(p => p.rating > 4.5).length;

    // Precio promedio por categoría
    const averagePriceByCategory = {};
    categories.forEach(cat => {
      const productsInCat = filteredProducts.filter(p => p.category === cat);
      const total = productsInCat.reduce((sum, p) => sum + p.price, 0);
      averagePriceByCategory[cat] = productsInCat.length ? total / productsInCat.length : 0;
    });

    // Más caro y más barato por categoría
    const extremesByCategory = {};
    categories.forEach(cat => {
      const productsInCat = filteredProducts.filter(p => p.category === cat);
      if (productsInCat.length) {
        const max = productsInCat.reduce((a, b) => (a.price > b.price ? a : b));
        const min = productsInCat.reduce((a, b) => (a.price < b.price ? a : b));
        extremesByCategory[cat] = {
          maxProduct: max.title,
          maxPrice: max.price,
          minProduct: min.title,
          minPrice: min.price
        };
      }
    });

    // Promedio de rating general y por categoría
    const averageRating = filteredProducts.length > 0
      ? filteredProducts.reduce((sum, p) => sum + p.rating, 0) / filteredProducts.length
      : 0;

    const averageRatingByCategory = {};
    categories.forEach(cat => {
      const productsInCat = filteredProducts.filter(p => p.category === cat);
      const total = productsInCat.reduce((sum, p) => sum + p.rating, 0);
      averageRatingByCategory[cat] = productsInCat.length ? total / productsInCat.length : 0;
    });

    //----------------------------Modo oscuro-----------------------------------
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        containerRef.current.classList.toggle("dark-mode");
    };

    //----------------------------------- Exportación de datos -------------------------------------
    //Usamos blob que va a representar datos binarios y usamos la url para descargar ese blob
    const handleExport = () => {
      if (format === "json") {
        const blob = new Blob([JSON.stringify(filteredProducts, null, 2)], { //convertimos en string 
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, "productos.json");
      } else if (format === "csv") {
          const csvData = convertProductsToCsvData(filteredProducts); //usamos la función de abajo con los productos filtrados
          const csvContent = csvData.map(row => row.join(",")).join("\n"); //toma cada fila y convierte sus valores en una línea de texto separada por comas
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          triggerDownload(url, "productos.csv");
        }
      };

    const convertProductsToCsvData = (products) => { //se necesita esto para pasar los productos a una tabla
      const headers = ['title', 'price', 'category']; //son los campos que va a mostrar
      const rows = products.map(p => [p.title, p.price, p.category]); //acá los mapea
      return [headers, ...rows];
    };

    const triggerDownload = (url, filename) => {
        const link = document.createElement("a"); //Crea el hipervínculo en el dom
        link.href = url; //le pasamos lo que va a tener
        link.download = filename;
        document.body.appendChild(link); //lo agregamos al dom
        link.click(); //hay que hacerle click
        document.body.removeChild(link);  //Eliminamos el hipervínculo
    };
  

//--------------------------Return----------------------------------
  return (
    <div ref={containerRef} className="min-h-screen">

    <div className="header flex justify-between items-center bg-pink-100 px-6 py-4">
      <h1 className="font-bold text-white text-2xl">
        ABP Proyecto Integrador
      </h1>
      <button
        onClick={toggleDarkMode}
        className="bg-white hover:bg-pink-100 text-gray-500 font-semibold py-2 px-4 border border-pink-200 rounded shadow"
      >
        Modo {darkMode ? "Claro" : "Oscuro"}
      </button>
    </div>
      
      <SearchBar
        search={search}
        setSearch={setSearch}
        noResults={filteredProducts.length === 0}
      />

      <div className='barra flex justify-center items-center gap-x-16 px-6 py-4'>
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />
      <SortSelector
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      </div>

     {/* ----------Esportación ----------- */}    
    <div className='text-sm '>
      <label className="px-4 mr-2 font-semibold">Seleccionar formato:</label>
      <select className="seleccion border border-gray-300 rounded px-3 py-1" 
        onChange={(e) => setFormat(e.target.value)} value={format}> {/* onChange para que vaya cambiando el formato de acuerdo a lo que se elija */}
        <option value="json">JSON</option> {/* y el value son las opciones */}
        <option value="csv">CSV</option>
      </select>
      <button className='bg-transparent hover:bg-pink-300 text-pink-400 font-semibold hover:text-white py-2 px-4 border border-pink-300 hover:border-transparent rounded ml-10' 
      onClick={handleExport}>Exportar archivo</button> {/* onClick para que cuando le hagan click haga la exportación */}
    </div>

      <ProductsList products={sortedProducts} />

      {/*------- Paginación --------*/}
      <div className='flex justify-between w-1/3 mx-auto mb-30'>
        <button className='border px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed' disabled={page === 1} onClick={() => {setPage(page - 1);}}>
          Página anterior
        </button>
        {/* Usamos el diabled para desabilitar el boton cuando la pag sea igual a 1. Cuando haga click, el setPage va a hacer que page reste 1*/}
        <h3>{page}</h3>
        <button className='border px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed' disabled={products.length < 30} onClick={() => {setPage(page + 1);}}>
          Página siguiente
        </button>
        {/* Acá es igual, se deshabilita cuanod la long de los productos sea menor a 30 y con cada click, page va a ir aumentando gracias al setPage */}
      </div>

      
      <div className="fondo text-center p-10">
        <button className='bg-transparent hover:bg-pink-300 text-pink-400 font-semibold hover:text-white py-2 px-4 border border-pink-300 hover:border-transparent rounded mb-20' 
        onClick={() => setShow(!show)}>{show ? "Ocultar Estadísticas" : "Mostrar Estadísticas"}</button> 
      </div>

      
    {show && (
      <>
        <div className='w-1/3 mx-auto border-t-4 border-gray-100'></div>
        <Stats
          max={maxPrice}
          min={minPrice}
          maxTitle={maxTitle}
          minTitle={minTitle}
          totalPrice={totalPrice}
          longTitle={longTitle}
        />
        <div className='w-1/3 mx-auto border-t-4 border-gray-100'></div>
        <DetailedStats
          averagePrice={averagePrice}
          productsByCategory={productsByCategory}
          highStockCount={highStockCount}
          highRatingCount={highRatingCount}
          averagePriceByCategory={averagePriceByCategory}
          extremesByCategory={extremesByCategory}
          averageRating={averageRating}
          averageRatingByCategory={averageRatingByCategory}
        />
        <div className='w-1/3 mx-auto border-t-4 border-gray-100'></div>
        <Charts
          productsByCategory={productsByCategory}
          allProducts={filteredProducts}
        />
      </>
    )}
    
    </div>
  )
}

export default App



