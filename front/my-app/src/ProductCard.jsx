function ProductCard({ title, article, image }) {
  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <img src={image} alt={title} className="product-card__image" />
      </div>

      <h3 className="product-card__title">{title}</h3>
      <p className="product-card__article">{article}</p>

      <button className="product-card__button">Изменить</button>
    </div>
  );
}

export default ProductCard;