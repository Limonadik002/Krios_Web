import { useNavigate } from "react-router-dom";
import styles from "./Card.module.css";

function Card({ id, art, title, price, imgSrc }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editing/${id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const getImageSrc = () => {
    if (!imgSrc || imgSrc.includes('example.com')) {
      return `https://placehold.co/300x300/006383/white?text=${encodeURIComponent(title)}`;
    }
    return imgSrc;
  };

  return (
    <div className={styles["card-wrapper"]}>
      <img src={getImageSrc()} alt={title} className={styles.image} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.article}>Артикул: {art}</p>
      <p className={styles.price}>{formatPrice(price)}</p>
      <button className={styles.change} onClick={handleEdit}>
        Изменить
      </button>
      <button className={styles.delete}>
        Удалить
      </button>
    </div>
  );
}

export default Card;