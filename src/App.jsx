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

    useEffect(() => {
      axios.get("https://dummyjson.com/products?limit=100").then((res) => {
        setProducts(res.data.products);
        const allCategories = [...new Set(res.data.products.map(p => p.category))];
        setCategories(allCategories);
      });
    }, []);


    const containerRef = useRef(null);

    //Filtra los productos
    const filteredProducts = products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    //Ordena los productos
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

      <ProductsList products={sortedProducts} />
      
      <div className="fondo text-center p-10">
        <button className='bg-transparent hover:bg-pink-300 text-pink-400 font-semibold hover:text-white py-2 px-4 border border-pink-300 hover:border-transparent rounded' onClick={() => setShow(!show)}>{show ? "Ocultar Estadísticas" : "Mostrar Estadísticas"}</button> 
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
          allProducts={products}
        />
      </>
    )}
    
    </div>
  )
}

export default App