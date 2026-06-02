import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import { API_ROUTES } from "../api";
import { authHeader } from "../auth";
import styles from "./Catolog.module.css";

function CatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const ITEMS_PER_PAGE = 20;

  const getMainPhoto = (photos) => {
    if (!photos || photos.length === 0) return "";
    const mainPhoto = photos.find(photo => photo.position === 1);
    return mainPhoto ? mainPhoto.url_photos : photos[0]?.url_photos || "";
  };

  // Фильтрация по поисковому запросу
  const filterProductsBySearch = (productsList, query) => {
    if (!query) return productsList;
    const lowerQuery = query.toLowerCase();
    return productsList.filter(product => 
      product.name?.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery)
    );
  };

  // Загрузка всех товаров
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(API_ROUTES.getObjects(1, 1000), {
        headers: { ...authHeader() },
      });
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data = await response.json();
      const allProductsData = Array.isArray(data) ? data : (data.objects || []);
      setAllProducts(allProductsData);
      setTotalCount(allProductsData.length);
      return allProductsData;
    } catch (err) {
      console.error("Ошибка загрузки товаров:", err);
      throw err;
    }
  };

  // Применение фильтрации и пагинации
  const applyFiltersAndPagination = (productsList, page, query) => {
    const filtered = filterProductsBySearch(productsList, query);
    const newTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages);
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const productsOnPage = filtered.slice(startIndex, endIndex);
    
    setProducts(productsOnPage);
    return filtered.length;
  };

  // Инициализация
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const allProductsData = await fetchAllProducts();
        applyFiltersAndPagination(allProductsData, currentPage, searchQuery);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Обновление при изменении страницы или поискового запроса
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFiltersAndPagination(allProducts, currentPage, searchQuery);
    }
  }, [currentPage, searchQuery, allProducts]);

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

  const filteredCount = searchQuery 
    ? filterProductsBySearch(allProducts, searchQuery).length 
    : totalCount;

  if (loading && products.length === 0) {
    return (
      <div className={styles["catalog-container"]}>
        <div className={styles["catalog-wraper"]}>
          <button className={styles.back} onClick={() => navigate("/Admin")}>
            Вернуться назад
          </button>
          <h1 className={styles["catalog-title"]}>Каталог товаров</h1>
          <div className={styles.loading}>Загрузка товаров...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["catalog-container"]}>
        <div className={styles["catalog-wraper"]}>
          <button className={styles.back} onClick={() => navigate("/Admin")}>
            Вернуться назад
          </button>
          <h1 className={styles["catalog-title"]}>Каталог товаров</h1>
          <div className={styles.error}>
            Ошибка: {error}
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="catalog-page">
      <div className={styles["catalog-container"]}>
        <div className={styles["catalog-wraper"]}>
          <button
            className={styles.back}
            onClick={() => navigate("/Admin")}
            type="button"
          >
            Вернуться назад
          </button>

          <h1 className={styles["catalog-title"]}>Каталог товаров</h1>

          {/* Только инфо о поиске, без формы! */}
          {searchQuery && (
            <div className={styles["search-info"]}>
              Результаты поиска: <strong>"{searchQuery}"</strong> — найдено {filteredCount} товаров
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
    </main>
  );
}

export default CatalogPage;