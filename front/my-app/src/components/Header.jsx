import styles from "./Header.module.css"
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.svg" className={styles["logo-img"]} alt="Logo" />
      </div>

      <div className={styles.stick}></div>

      <div className="logo-right">
        <h1>КРИОС</h1>
        <p>КЛИМАТИЧЕСКОЕ ОБОРУДОВАНИЕ</p>
      </div>
    </header>
  );
}

export default Header;
