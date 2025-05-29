import './App.css'
import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import ProductsList from './components/ProductsList'
import Stats from './components/StatsPanel';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import SortSelector from './components/SortSelector';


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
        <Stats
          max={maxPrice}
          min={minPrice}
          maxTitle={maxTitle}
          minTitle={minTitle}
          totalPrice={totalPrice}
          longTitle={longTitle}
        />
      )}
    
    </div>
  )
}

export default App