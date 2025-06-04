import './App.css'
import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import ProductsList from './components/ProductsList'
import Stats from './components/StatsPanel';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import SortSelector from './components/SortSelector';
import DetailedStats from './components/DetailedStats';


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

    const containerRef = useRef(null);
    
  // 1. Cargar las categorías UNA SOLA VEZ
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await axios.get("https://dummyjson.com/products/categories");
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  // 2. Cargar productos cada vez que cambia la categoría
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url =
          selectedCategory === "all"
            ? "https://dummyjson.com/products?limit=100"
            : `https://dummyjson.com/products/category/${selectedCategory}`;

        const res = await axios.get(url);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

    // Filtro por búsqueda
    const filteredProducts = products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

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
      <h1 className="font-bold text-center bg-pink-100  text-gray-700 text-2xl p-10">Productos</h1>

      <button onClick={toggleDarkMode}>Modo {darkMode ? "Claro" : "Oscuro"}</button>

      <SearchBar
        search={search}
        setSearch={setSearch}
        noResults={filteredProducts.length === 0}
      />

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
      
      <ProductsList products={sortedProducts} />
      
      <div className="fondo text-center p-10">
        <button className='bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white py-2 px-4 border border-cyan-500 hover:border-transparent rounded' onClick={() => setShow(!show)}>{show ? "Ocultar Estadísticas" : "Mostrar Estadísticas"}</button> 
      </div>

    {show && (
      <>
        <Stats
          max={maxPrice}
          min={minPrice}
          maxTitle={maxTitle}
          minTitle={minTitle}
          totalPrice={totalPrice}
          longTitle={longTitle}
        />
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
      </>
    )}
    
    </div>
  )
}

export default App