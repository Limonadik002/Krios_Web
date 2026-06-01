import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../api";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_ROUTES.registerAdmin(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Неверный пароль");
      }

      const token = await response.json();
      
      localStorage.setItem("token", token);
      
      navigate("/admin");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["register-container"]}>
      <form className={styles["register-form"]} onSubmit={handleSubmit}>
        <h1 className={styles["register-title"]}>Регистрация админа</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles["input-group"]}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles["register-button"]}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}

export default Register;