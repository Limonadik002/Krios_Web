import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/Admin")} style={{ cursor: 'pointer' }}>
        <img src="/logo.svg" className={styles["logo-img"]} alt="Logo" />
      </div>

      <div className={styles.stick}></div>

      <div className={styles["logo-right"]} onClick={() => navigate("/Admin")} style={{ cursor: 'pointer' }}>
        <h1>КРИОС</h1>
        <p>КЛИМАТИЧЕСКОЕ ОБОРУДОВАНИЕ</p>
      </div>

      {location.pathname.toLowerCase() === "/catalog" && (
        <div className={styles["search-container"]}>
          <SearchBar />
        </div>
      )}
    </header>
  );
}

export default Header;