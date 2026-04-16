import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import styles from "./Catalog.module.css";

function CatalogPage() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [searchMode, setSearchMode] = useState(false);

  const ITEMS_PER_PAGE = 20;

  const getMainPhoto = (photos) => {
    if (!photos || photos.length === 0) return "";
    const mainPhoto = photos.find(photo => photo.position === 1);
    return mainPhoto ? mainPhoto.url_photos : photos[0]?.url_photos || "";
  };

  const fetchProducts = async (page) => {
    setLoading(true);
    setError(null);

    try {
      // Если пришли результаты поиска
      if (location.state?.searchResults) {
        setProducts(location.state.searchResults);
        setTotalCount(location.state.searchResults.length);
        setTotalPages(Math.ceil(location.state.searchResults.length / ITEMS_PER_PAGE));
        setSearchMode(true);
        // Очищаем state чтобы при обновлении не оставаться в режиме поиска
        window.history.replaceState({}, document.title);
        return;
      }

      // Обычная загрузка всех товаров
      if (totalCount === null) {
        const allResponse = await fetch(`/api/GetObjects?page=1&limit=180`);
        const allData = await allResponse.json();
        const allProducts = Array.isArray(allData) ? allData : (allData.objects || []);
        
        setTotalCount(allProducts.length);
        setTotalPages(Math.ceil(allProducts.length / ITEMS_PER_PAGE));
      }
      
      const response = await fetch(`/api/GetObjects?page=${page}&limit=${ITEMS_PER_PAGE}`);
      
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      
      const data = await response.json();
      const productsOnPage = Array.isArray(data) ? data : (data.objects || []);
      
      setProducts(productsOnPage);
      setSearchMode(false);
      
    } catch (err) {
      console.error("Ошибка загрузки товаров:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, location.state]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const MAX_VISIBLE = 9;

    let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE / 2));
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE - 1);

    if (endPage - startPage < MAX_VISIBLE - 1) {
      startPage = Math.max(1, endPage - MAX_VISIBLE + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles["catalog-container"]}>
        <div className={styles["catalog-wraper"]}>
          <h1 className={styles["catalog-title"]}>
            {searchMode ? "Результаты поиска" : "Каталог товаров"}
          </h1>
          <div className={styles.loading}>Загрузка товаров...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["catalog-container"]}>
        <div className={styles["catalog-wraper"]}>
          <h1 className={styles["catalog-title"]}>Каталог товаров</h1>
          <div className={styles.error}>
            Ошибка: {error}
            <button onClick={() => fetchProducts(currentPage)}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["catalog-container"]}>
      <div className={styles["catalog-wraper"]}>
        <h1 className={styles["catalog-title"]}>
          {location.state?.searchQuery 
            ? `Результаты поиска: "${location.state.searchQuery}"`
            : location.state?.selectedCategory
            ? `Категория: ${location.state.selectedCategory}`
            : "Каталог товаров"
          }
        </h1>

        {products.length === 0 && (
          <div className={styles["no-results"]}>
            Ничего не найдено
          </div>
        )}

        <div className={styles["catalog-grid"]}>
          {products.map((product) => (
            <Card
              key={product.article}
              id={product.article}
              art={product.article}
              title={product.name}
              price={product.price}
              imgSrc={getMainPhoto(product.photos)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.arrow}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {renderPaginationButtons()}

            <button
              className={styles.arrow}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;