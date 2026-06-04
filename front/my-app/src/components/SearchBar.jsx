import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../api";
import { authHeader } from "../auth";
import styles from "./SearchBar.module.css";

function SearchBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Загрузка категорий из товаров
  const fetchCategories = async () => {
    try {
      const res = await fetch(API_ROUTES.getObjects(1, 100), {
        headers: { ...authHeader() },
      });
      const data = await res.json();
      const products = Array.isArray(data) ? data : (data.objects || []);
      
      // Вытаскиваем уникальные категории
      const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleCategoryClick = (cat) => {
    setQuery(cat);
    navigate(`/catalog?search=${encodeURIComponent(cat)}`);
    setIsOpen(false);
  };

  return (
    <div className={styles["search-container"]}>
      <div className={styles["search-wrapper"]} ref={searchRef}>
        <div
          className={`${styles["search-bar"]} ${isOpen ? styles["search-bar-open"] : ""}`}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <div className={styles["search-content"]}>
            <input
              ref={inputRef}
              type="text"
              className={styles["search-input"]}
              placeholder="Поиск по сайту"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyPress={handleKeyPress}
            />
            <svg 
              className={styles["search-icon"]} 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none"
              onClick={handleSearch}
              style={{ cursor: 'pointer' }}
            >
              <path d="M14.5 25C20.299 25 25 20.299 25 14.5C25 8.70101 20.299 4 14.5 4C8.70101 4 4 8.70101 4 14.5C4 20.299 8.70101 25 14.5 25Z" stroke="#006383" strokeWidth="2"/>
              <path d="M28 28L22 22" stroke="#006383" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;