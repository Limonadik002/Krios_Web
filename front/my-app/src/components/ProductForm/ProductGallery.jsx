import styles from "./ProductForm.module.css";
import { EditIcon } from "./icons";

function ProductGallery({
  images,
  mainImage,
  setMainImage,
  getImageSrc,
  title,
  onAddImage,
  onEditImage,
  maxImages = 5,
}) {
  const visibleImages = images.slice(0, maxImages);

  return (
    <div className={styles.gallery}>
      <div className={styles.previewList}>
        {visibleImages.length > 0 ? (
          visibleImages.map((image, index) => {
            const src = getImageSrc(image);

            return (
              <button
                type="button"
                key={index}
                className={styles.previewThumb}
                onClick={() => setMainImage(src)}
              >
                <img src={src} alt={`Фото ${index + 1}`} />
              </button>
            );
          })
        ) : (
          Array.from({ length: maxImages }).map((_, index) => (
            <div key={index} className={styles.previewThumb} />
          ))
        )}
      </div>

      <div className={styles.mainImage}>
        {mainImage ? (
          <img src={mainImage} alt={title || "Товар"} />
        ) : (
          <div className={styles.emptyImage}>Нет фото</div>
        )}

        <div className={styles.imageActions}>
          {onAddImage && images.length < maxImages && (
            <button
              type="button"
              className={styles.imageButton}
              onClick={onAddImage}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12H20M12 4V20"
                  stroke="#006383"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {onEditImage && (
            <button
              type="button"
              className={styles.imageButton}
              onClick={onEditImage}
            >
              <EditIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductGallery;