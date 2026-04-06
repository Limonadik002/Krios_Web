import styles from "./Card.module.css"
function Card({ imgSrc, title, art }) {
  return (
    <>
      <div className={styles["card-wrapper"]}>
        <img src={`${imgSrc}`} alt="" />
        <h2>{title}</h2>
        <p>{art}</p>
        <button className={styles.change}>Изменить</button>
        <button className={styles.delete}>Удалить</button>
      </div>

     
    </>
  );
}

export default Card;