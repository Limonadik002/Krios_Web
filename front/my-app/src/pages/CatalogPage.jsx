import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import styles from "./Catalog.module.css";

function CatalogPage() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  const ITEMS_PER_PAGE = 20;
  const API_BASE_URL = "http://26.58.122.182:8080";

  const getMainPhoto = (photos) => {
    if (!photos || photos.length === 0) return "";
    const mainPhoto = photos.find(photo => photo.position === 1);
    return mainPhoto ? mainPhoto.url_photos : photos[0]?.url_photos || "";
  };

  const fetchProducts = async (page) => {
  setLoading(true);
  setError(null);

  try {
    // 1. Один раз получаем ВСЕ товары (с limit=180)
    if (totalCount === null) {
      const allResponse = await fetch(
        `${API_BASE_URL}/GetObjects?page=1&limit=180`
      );
      const allData = await allResponse.json();
      const allProducts = Array.isArray(allData) ? allData : (allData.objects || []);
      
      setTotalCount(allProducts.length);
      setTotalPages(Math.ceil(allProducts.length / ITEMS_PER_PAGE));
    }
    
    // 2. Запрашиваем нужную страницу (с нормальным limit=20)
    const response = await fetch(
      `${API_BASE_URL}/GetObjects?page=${page}&limit=${ITEMS_PER_PAGE}`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    
    const data = await response.json();
    const productsOnPage = Array.isArray(data) ? data : (data.objects || []);
    
    setProducts(productsOnPage);
    
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
  }, [currentPage]);

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
            <button onClick={() => fetchProducts(currentPage)}>Повторить</button>
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