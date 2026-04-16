import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(true); // Показываем категории или результаты поиска
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const showSearch = location.pathname === "/catalog";

  // Загрузка популярных категорий
  const fetchPopularCategories = async () => {
    try {
      const response = await fetch(`/api/GetPopularCategories`);
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data = await response.json();
      const popularCategories = Array.isArray(data) ? data : (data.categories || []);
      setCategories(popularCategories);
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err);
      setCategories([
        "Велосипеды",
        "Велосипедные рамы",
        "Велосипедные колеса",
        "Велосипедные педали",
        "Самокаты",
        "Ролики",
        "Скейтборды"
      ]);
    }
  };

  // Живой поиск товаров при вводе текста
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowCategories(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/SearchObjects?query=${encodeURIComponent(query)}&limit=10`);
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data = await response.json();
      let results = Array.isArray(data) ? data : (data.objects || []);
      
      // Фильтруем по названию
      results = results.filter(product => 
        product.name && product.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      setShowCategories(false);
    } catch (err) {
      console.error("Ошибка поиска:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce для поиска (чтобы не спамить бэк)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      } else {
        setSearchResults([]);
        setShowCategories(true);
      }
    }, 300); // Задержка 300мс

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && categories.length === 0) {
      fetchPopularCategories();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchQuery("");
      setSearchResults([]);
      setShowCategories(true);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Выбор товара из выпадающего списка
  const handleProductSelect = (product) => {
    navigate("/catalog", { 
      state: { 
        searchResults: [product], 
        searchQuery: searchQuery,
        singleProduct: true 
      } 
    });
    setIsSearchOpen(false);
  };

  // Выбор категории
  const handleCategorySelect = async (category) => {
    try {
      const response = await fetch(`/api/GetObjectsByCategory?category=${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data = await response.json();
      const results = Array.isArray(data) ? data : (data.objects || []);
      
      navigate("/catalog", { 
        state: { 
          searchResults: results, 
          selectedCategory: category 
        } 
      });
      setIsSearchOpen(false);
    } catch (err) {
      console.error("Ошибка загрузки категории:", err);
    }
  };

  // Поиск по Enter
  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    
    navigate("/catalog", { 
      state: { 
        searchResults: searchResults, 
        searchQuery: searchQuery 
      } 
    });
    setIsSearchOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Подсветка совпадений в тексте
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={index} className={styles.highlight}>{part}</span> : 
        part
    );
  };

  return (
    <>
      {isSearchOpen && <div className={styles.overlay} onClick={() => setIsSearchOpen(false)} />}
      
      <header className={styles.header}>
        <div className={styles["header-left"]}>
          <div className={styles.logo}>
            <img src="/logo.svg" className={styles["logo-img"]} alt="Logo" />
          </div>

          <div className={styles.stick}></div>

          <div className={styles["logo-right"]}>
            <h1>КРИОС</h1>
            <p>КЛИМАТИЧЕСКОЕ ОБОРУДОВАНИЕ</p>
          </div>
        </div>

        {showSearch && (
          <div className={styles["header-center"]} ref={searchRef}>
            <div className={styles["search-wrapper"]}>
              <div 
                className={`${styles["search-container"]} ${isSearchOpen ? styles["search-container-focused"] : ""}`}
                onClick={() => setIsSearchOpen(true)}
              >
                <div className={styles["search-content"]}>
                  <input 
                    type="text"
                    className={styles["search-input"]}
                    placeholder="Поиск по сайту"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsSearchOpen(true)}
                    autoComplete="off"
                  />
                  <svg
                    className={styles["search-icon"]}
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleSearchSubmit}
                  >
                    <path
                      d="M14.5 25C20.299 25 25 20.299 25 14.5C25 8.70101 20.299 4 14.5 4C8.70101 4 4 8.70101 4 14.5C4 20.299 8.70101 25 14.5 25Z"
                      stroke="#006383"
                      strokeWidth="2"
                    />
                    <path
                      d="M28 28L22 22"
                      stroke="#006383"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Выпадающее меню */}
              {isSearchOpen && (
                <div className={styles["search-dropdown"]} ref={dropdownRef}>
                  {showCategories ? (
                    <>
                      <h2 className={styles["dropdown-title"]}>Популярные категории</h2>
                      <div className={styles["categories-list"]}>
                        {categories.map((category, index) => (
                          <div 
                            key={index} 
                            className={styles["category-item"]}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className={styles["dropdown-title"]}>
                        {searchQuery ? `Результаты поиска: "${searchQuery}"` : "Результаты поиска"}
                      </h2>
                      <div className={styles["search-results-list"]}>
                        {loading ? (
                          <div className={styles["loading-results"]}>Поиск...</div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((product) => (
                            <div 
                              key={product.article} 
                              className={styles["search-result-item"]}
                              onClick={() => handleProductSelect(product)}
                            >
                              <img 
                                src={product.photos?.[0]?.url_photos || "/placeholder.png"} 
                                alt={product.name}
                                className={styles["result-image"]}
                              />
                              <div className={styles["result-info"]}>
                                <div className={styles["result-name"]}>
                                  {highlightMatch(product.name, searchQuery)}
                                </div>
                                <div className={styles["result-article"]}>
                                  Артикул: {product.article}
                                </div>
                                <div className={styles["result-price"]}>
                                  {product.price?.toLocaleString()} ₽
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles["no-results"]}>
                            Ничего не найдено
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles["header-right"]}>
          <button 
            className={styles["back-button"]}
            onClick={() => navigate("/Admin")}
          >
            ← Вернуться назад
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;