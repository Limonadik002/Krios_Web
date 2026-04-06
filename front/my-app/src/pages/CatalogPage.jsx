import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";
import Card from "../components/Сard";
import styles from "./Catolog.module.css"

function CatalogPage() {
  const navigate = useNavigate();


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
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
            <Card art="21312" title="wqeqw" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default CatalogPage;