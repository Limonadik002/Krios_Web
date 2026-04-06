import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.adm}>
      <h1>Админ-панель</h1>

      <div className={styles.buttons}>
        <button
          className={styles["catalog-button"]}
          onClick={() => navigate("/catalog")}
        >
          Каталог
        </button>

        <button
          className={styles["add-button"]}
          onClick={() => navigate("/add-product")}
        >
          Добавить товар
        </button>
      </div>
    </div>
  );
}

export default AdminPage;