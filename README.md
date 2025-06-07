# ABP

Nombre: Brenda Amaya

Para desarrollar el ABP se tomó de base al proyecto que se venía trabajando en las evidencias anteriores. Se incorporaron distintos componentes y se estilizó para que quede ordenado y coherente.

## Instrucciones para ejecutar el proyecto.

Este proyecto fue desarrollado con **React** usando **Vite**, **Tailwind CSS**, **Axios** y **Recharts**. Se debe tener instalado **Node.js**.

1. Clonar el repositorio
2. npm install
3. npm run dev

## Lógica principal

- Se utiliza useEffect para cargar productos desde la API dummyjson y actualizar la UI al cambiar de página.

- Se implementa paginación, filtrado por categoría, búsqueda por nombre, y ordenamiento por precio o rating.

- Se agregan estadísticas básicas y detalladas a partir de los productos filtrados.

- Se ofrece exportación de datos en formato JSON o CSV.

## Funcionamiento

- **App.jsx**: Integra todos los componentes y los estados necesarios para el proyecto, como también la lógica de filtrado, ordenamiento y exportación.

- **ProductList**: Utiliza el diseño de una card de Ecommerce de Tailblocks y muestra la lista de productos.

- **ProductItem**: Utiliza el diseño de una card de Stats de Tailblocks y muestra las nuevas estadísticas.

- **SearchBar**: Contiene la barra de búsqueda, se mantuvo el diseño y lo que cambió fue la longitud.

- **CategoryFilter**: Para el filtrado de categoría se optó por usar una label y un select. Incorpora un onChange para que al seleccionar una categoría se cambie a esa.

- **SortSelector**: Con una lógica parecida al componente anterior, nos permite ordenar los productos por precio o rating gracias al onChange. Para el ordenamiento se utliza la función _sort_.

- **Stats**: Se mantuvo el diseño de la evidencia 2, mostrando un diseño de una card de Stats de Tailblocks.

- **Detailed Stats**: Utiliza el último diseño de la parte de Feature de Tailblocks. Se incorporaron las props necesarias para que se muestre cada estadística.

- **Charts**: Encontramos los tres gráficos principales, con una visualización en barras, gráfico de líneas y un pie chart. Se usó como base Recharts.

- **Paginación**: La paginación se encuentra dentro del App.jsx. El estado page, setPage va a llevar el registro de la página en donde estoy. Y en el useEffect de los productos, lo modifcamos para que en la dependencia esté page. Gracias a los botones con onClick la página va cambiando.

- **Exportación**: Para la exportación usamos blob y creamos una url temporal para descargar los archivos. Para JSON fue simple porque se puede usar stringify a la lista de productos filtrados y ya está. En cambio CSV primero se necesitan pasar los datos a una tabla por lo que se usa una función aparte para esto.

## Estilos

- El proyecto tiene un motivo rosa e incorpora distintas cards de Tailblocks.

- Para el header se basó en una de las cards e incluye el botón DarkMode, para el cual que se utilizó la documentación de Tailwind buttons.

- El mismo botón se modificó y se aplicó también a todos los botones que se muestran.

- Se agregó una barra divisora como salen en algunas cards de Tailblocks y se mantuvo el fondo blanco a diferencia de antes por una cuestión estética.

- Se adapta tanto a modo claro como a oscuro.
