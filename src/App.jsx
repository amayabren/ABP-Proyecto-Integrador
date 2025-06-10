import "./App.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProductsList from "./components/ProductsList";
import Stats from "./components/StatsPanel";
import SearchBar from "./components/SearchBar";
import SortSelector from "./components/SortSelector";
import CategoryFilter from "./components/CategoryFilter";
import Pagination from "./components/Pagination";
import DetailedStats from "./components/DetailedStats";
import Charts from "./components/Charts";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [page, setPage] = useState(1);
  const [format, setFormat] = useState("json"); // selección del formato para exportación

  const limit = 30;

  //El fitro de categorías no funcionaba correctamente si lo hacía en el mismo useEffect que los productos. Para que se muestren correctamente todas
  //las categorías, primero hago el useEffect para ellas y después hago la de los productos. Sino iba a depender de la paginación para mostrar las cat de los productos
  //Trae categorías con slug, name, url que es como salen en la página de dummyjson
  useEffect(() => {
    axios.get("https://dummyjson.com/products/categories").then((res) => {
      setCategories(res.data); // res.data es array de objetos
    });
  }, []);

  //Trae productos filtrados por categoría y paginados
  useEffect(() => {
    const url =
      selectedCategory === "all"
        ? `https://dummyjson.com/products?limit=${limit}&skip=${
            (page - 1) * limit
          }` //acá uso el código original
        : `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${
            (page - 1) * limit
          }`; //acá puedo mostrar de acuerdo a la cat que antes definí

    axios.get(url).then((res) => {
      setProducts(res.data.products); //el get nos trae de acuerdo a la cat seleccionada
    });
  }, [page, selectedCategory]); //y como dependencias tenemos page y también la cat seleccionada

  const containerRef = useRef(null); //para el modo oscuro

  //resetea la página cuando cambia categoría
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  //filtro de productos
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  //ordenamiento
  if (sortBy === "priceAsc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceDesc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "ratingAsc") {
    filteredProducts.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === "ratingDesc") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  //---------------------------Estadísticas-------------------------------------
  const prices = filteredProducts.map((p) => p.price);
  const hasPrices = prices.length > 0;

  const maxPrice = hasPrices ? Math.max(...prices) : 0;
  const maxProduct = filteredProducts.find((p) => p.price === maxPrice);
  const maxTitle = maxProduct?.title || "";

  const minPrice = hasPrices ? Math.min(...prices) : 0;
  const minProduct = filteredProducts.find((p) => p.price === minPrice);
  const minTitle = minProduct?.title || "";

  const totalPrice = filteredProducts.reduce((sum, p) => sum + p.price, 0);
  const longTitle = filteredProducts.filter((p) => p.title.length > 20).length;

  //-------------------- Nuevas estadísticas detalladas ------------------------
  //Ajustamos categories para que sea un array solo con slugs según el filtro
  const categorySlugs = categories.map((cat) => cat.slug);

  //Precio promedio general
  const averagePrice =
    filteredProducts.length > 0
      ? filteredProducts.reduce((sum, p) => sum + p.price, 0) /
        filteredProducts.length
      : 0;

  //Cantidad de productos por categoría
  const productsByCategory = {};
  filteredProducts.forEach((p) => {
    productsByCategory[p.category] = (productsByCategory[p.category] || 0) + 1;
  });

  //Stock > 50 y rating > 4.5
  const highStockCount = filteredProducts.filter((p) => p.stock > 50).length;
  const highRatingCount = filteredProducts.filter((p) => p.rating > 4.5).length;

  //Precio promedio por categoría
  const averagePriceByCategory = {};
  categorySlugs.forEach((cat) => {
    const productsInCat = filteredProducts.filter((p) => p.category === cat);
    const total = productsInCat.reduce((sum, p) => sum + p.price, 0);
    averagePriceByCategory[cat] = productsInCat.length
      ? total / productsInCat.length
      : 0;
  });

  //Más caro y más barato por categoría
  const extremesByCategory = {};
  categorySlugs.forEach((cat) => {
    const productsInCat = filteredProducts.filter((p) => p.category === cat);
    if (productsInCat.length) {
      const max = productsInCat.reduce((a, b) => (a.price > b.price ? a : b));
      const min = productsInCat.reduce((a, b) => (a.price < b.price ? a : b));
      extremesByCategory[cat] = {
        maxProduct: max.title,
        maxPrice: max.price,
        minProduct: min.title,
        minPrice: min.price,
      };
    }
  });

  // Promedio de rating general y por categoría
  const averageRating =
    filteredProducts.length > 0
      ? filteredProducts.reduce((sum, p) => sum + p.rating, 0) /
        filteredProducts.length
      : 0;

  const averageRatingByCategory = {};
  categorySlugs.forEach((cat) => {
    const productsInCat = filteredProducts.filter((p) => p.category === cat);
    const total = productsInCat.reduce((sum, p) => sum + p.rating, 0);
    averageRatingByCategory[cat] = productsInCat.length
      ? total / productsInCat.length
      : 0;
  });

  //----------------------------Modo oscuro-----------------------------------
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    containerRef.current.classList.toggle("dark-mode");
  };

  //---------------------- Exportación de datos ----------------------
  //Usamos blob que va a representar datos binarios y usamos la url para descargar ese blob
  const handleExport = () => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(filteredProducts, null, 2)], {
        //convertimos en string
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, "productos.json");
    } else if (format === "csv") {
      const csvData = convertProductsToCsvData(filteredProducts); //usamos la función de abajo con los productos filtrados
      const csvContent = csvData.map((row) => row.join(",")).join("\n"); //toma cada fila y convierte sus valores en una línea de texto separada por comas
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, "productos.csv");
    }
  };

  const convertProductsToCsvData = (products) => {
    //se necesita esto para pasar los productos a una tabla
    const headers = ["title", "price", "category"]; //son los campos que va a mostrar
    const rows = products.map((p) => [p.title, p.price, p.category]); //acá los mapea
    return [headers, ...rows];
  };

  const triggerDownload = (url, filename) => {
    const link = document.createElement("a"); //Crea el hipervínculo en el dom
    link.href = url; //le pasamos lo que va a tener
    link.download = filename;
    document.body.appendChild(link); //lo agregamos al dom
    link.click(); //hay que hacerle click
    document.body.removeChild(link); //Eliminamos el hipervínculo
  };

  return (
    <div ref={containerRef} className="min-h-screen">
      <div className="header flex justify-between items-center bg-pink-200 px-6 py-4">
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

      <div className="flex gap-4 justify-center items-center mb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />
        <SortSelector sortBy={sortBy} onChange={setSortBy} />
      </div>

      {/* ----------------------Esportación ------------------ */}
      <div className="text-sm">
        <label className="px-4 mr-2 font-semibold">Seleccionar formato:</label>
        <select
          className="seleccion border border-gray-300 rounded px-3 py-1"
          onChange={(e) => setFormat(e.target.value)}
          value={format}
        >
          {" "}
          {/* la igual que en el SortSelector, el onChange es para que cambie de formato de acuerdo a lo que se elija */}
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
        <button
          className="bg-transparent hover:bg-pink-300 text-pink-400 font-semibold hover:text-white py-2 px-4 border border-pink-300 hover:border-transparent rounded ml-10"
          onClick={handleExport}
          disabled={!format}
        >
          {" "}
          {/* onClick para que cuando le hagan click haga la exportación */}
          Exportar archivo
        </button>
      </div>

      <ProductsList products={filteredProducts} />

      <Pagination page={page} setPage={setPage} products={products} />

      <div className="fondo text-center p-10">
        <button
          className="bg-transparent hover:bg-pink-300 text-pink-500 font-semibold hover:text-white py-2 px-4 border border-pink-300 hover:border-transparent mb-20 mt-10 rounded"
          onClick={() => setShow(!show)}
        >
          {show ? "Ocultar Estadísticas" : "Mostrar Estadísticas"}
        </button>
      </div>

      {show && (
        <>
          <div className="w-1/3 mx-auto border-t-4 border-gray-100"></div>
          <Stats
            max={maxPrice}
            min={minPrice}
            maxTitle={maxTitle}
            minTitle={minTitle}
            totalPrice={totalPrice}
            longTitle={longTitle}
          />
          <div className="w-1/3 mx-auto border-t-4 border-gray-100"></div>
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
          <div className="w-1/3 mx-auto border-t-4 border-gray-100"></div>
          <Charts
            productsByCategory={productsByCategory}
            allProducts={filteredProducts}
            categories={categories}
          />
        </>
      )}
    </div>
  );
}

export default App;
