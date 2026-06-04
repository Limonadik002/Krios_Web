import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Create.module.css";

const CREATE_PRODUCT_URL = "http://localhost:5000/products";
const UPLOAD_IMAGE_URL = "http://localhost:5000/products/images";

const EditIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.3827 4.2036L19.1467 5.4396L7.7854 16.7996C7.01607 17.5703 6.63073 17.9556 6.30007 18.3796C5.90992 18.8802 5.57509 19.4216 5.3014 19.9943C5.07073 20.4796 4.89873 20.9969 4.55473 22.0289L3.09607 26.4036L2.73873 27.4729C2.65515 27.7222 2.64275 27.9898 2.70292 28.2457C2.7631 28.5017 2.89346 28.7357 3.07936 28.9216C3.26526 29.1075 3.49933 29.2379 3.75525 29.2981C4.01117 29.3582 4.2788 29.3458 4.52807 29.2623L5.5974 28.9049L9.97207 27.4463C11.0054 27.1023 11.5214 26.9303 12.0067 26.6996C12.5818 26.4258 13.1201 26.0929 13.6214 25.7009C14.0454 25.3703 14.4307 24.9849 15.2001 24.2156L26.5614 12.8543L27.7974 11.6183C28.7806 10.635 29.333 9.30145 29.333 7.91093C29.333 6.52041 28.7806 5.18684 27.7974 4.2036C26.8142 3.22035 25.4806 2.66797 24.0901 2.66797C22.6995 2.66797 21.366 3.22035 20.3827 4.2036Z"
      stroke="#006383"
      strokeWidth="2"
    />
    <path
      opacity="0.5"
      d="M19.1464 5.4375C19.1464 5.4375 19.301 8.06417 21.6184 10.3815C23.9357 12.6988 26.561 12.8522 26.561 12.8522M5.59704 28.9042L3.0957 26.4028"
      stroke="#006383"
      strokeWidth="2"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 5.71429H5.66667L7.33333 28H20.6667L22.3333 5.71429H4M14 11.2857V22.4286M18.1667 11.2857L17.3333 22.4286M9.83333 11.2857L10.6667 22.4286M10.6667 5.71429L11.5 2H16.5L17.3333 5.71429"
      stroke="#006383"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 21.414L9 16.413L10.413 15L14 18.586L21.585 11L23 12.415L14 21.414Z"
      fill="#006383"
    />
    <path
      d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2ZM16 28C13.6266 28 11.3066 27.2962 9.33316 25.9776C7.35977 24.6591 5.8217 22.7849 4.91345 20.5922C4.0052 18.3995 3.76756 15.9867 4.23058 13.6589C4.69361 11.3311 5.83649 9.19295 7.51472 7.51472C9.19296 5.83649 11.3312 4.6936 13.6589 4.23058C15.9867 3.76755 18.3995 4.00519 20.5922 4.91345C22.7849 5.8217 24.6591 7.35977 25.9776 9.33316C27.2962 11.3065 28 13.6266 28 16C28 19.1826 26.7357 22.2348 24.4853 24.4853C22.2348 26.7357 19.1826 28 16 28Z"
      fill="#006383"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4V16M4 10H16"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

function Create() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [price, setPrice] = useState("");
  const [params, setParams] = useState([]);

  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Нет токена авторизации");
    }

    return token;
  };

  const startEdit = (fieldName) => {
    setEditingField(fieldName);
  };

  const saveEdit = () => {
    setEditingField(null);
  };

  const deleteTitle = () => {
    setTitle("");
    setEditingField(null);
  };

  const deleteArticle = () => {
    setArticle("");
    setEditingField(null);
  };

  const deletePrice = () => {
    setPrice("");
    setEditingField(null);
  };

  const addParam = () => {
    setParams((prev) => [...prev, `Параметр ${prev.length + 1}`]);
  };

  const changeParam = (index, value) => {
    setParams((prev) =>
      prev.map((param, paramIndex) =>
        paramIndex === index ? value : param
      )
    );
  };

  const deleteParam = (index) => {
    setParams((prev) =>
      prev.filter((_, paramIndex) => paramIndex !== index)
    );

    setEditingField(null);
  };

  const closeImageModal = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    setIsDragging(false);
    setIsImageModalOpen(false);
  };

  const handleImageFile = (file) => {
    if (!file) return;

    if (file.type !== "image/webp") {
      setError("Можно загружать только изображения в формате WebP");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files?.[0];

    handleImageFile(file);

    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    handleImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadImage = async () => {
    if (!imageFile) {
      setError("Сначала выберите изображение");
      return;
    }

    try {
      setImageLoading(true);
      setError("");

      const token = getToken();

      const formData = new FormData();

      // ВАЖНО:
      // "image" должно совпадать с тем, что ждёт backend.
      // Например, если на бэке upload.single("image"), оставляй "image".
      // Если upload.single("file"), поменяй на "file".
      formData.append("image", imageFile);

      const response = await fetch(UPLOAD_IMAGE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Не удалось загрузить изображение");
      }

      const uploadedImage = await response.json();

      setImages((prev) => [...prev, uploadedImage]);

      closeImageModal();
    } catch (err) {
      setError(err.message || "Ошибка при загрузке изображения");
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      title: title.trim(),
      article: article.trim(),
      price: price.trim(),
      params: params.map((param) => param.trim()).filter(Boolean),
      images,
    };

    if (!productData.title) {
      setError("Введите название товара");
      return;
    }

    if (!productData.article) {
      setError("Введите артикул");
      return;
    }

    if (!productData.price) {
      setError("Введите цену");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(CREATE_PRODUCT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Не удалось создать товар");
      }

      navigate("/Catalog");
    } catch (err) {
      setError(err.message || "Ошибка при создании товара");
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (image) => {
    return image?.url || image?.path || image?.imageUrl || image;
  };

  return (
    <section className={styles.create}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        Вернуться назад
      </button>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.titleRow}>
          {editingField === "title" ? (
            <>
              <input
                className={styles.titleInput}
                value={title}
                placeholder="Название товара"
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveEdit();
                  }
                }}
              />

              <button
                type="button"
                className={styles.iconButton}
                onClick={saveEdit}
              >
                <CheckIcon />
              </button>

              <button
                type="button"
                className={styles.iconButton}
                onClick={deleteTitle}
              >
                <TrashIcon />
              </button>
            </>
          ) : (
            <>
              <h1 className={styles.pageTitle}>
                {title || "Название товара"}
              </h1>

              <button
                type="button"
                className={styles.iconButton}
                onClick={() => startEdit("title")}
              >
                <EditIcon />
              </button>

              <button
                type="button"
                className={styles.iconButton}
                onClick={deleteTitle}
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.gallery}>
            <div className={styles.previewList}>
              {images.length > 0 ? (
                images.slice(0, 5).map((image, index) => (
                  <div key={index} className={styles.previewThumb}>
                    <img
                      src={getImageSrc(image)}
                      alt={`Фото товара ${index + 1}`}
                      className={styles.previewImage}
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className={styles.previewThumb}></div>
                  <div className={styles.previewThumb}></div>
                  <div className={styles.previewThumb}></div>
                  <div className={styles.previewThumb}></div>
                  <div className={styles.previewThumb}></div>
                </>
              )}
            </div>

            <div className={styles.mainImage}>
              {images[0] && (
                <img
                  src={getImageSrc(images[0])}
                  alt="Главное фото товара"
                  className={styles.mainImagePreview}
                />
              )}

              <button
                type="button"
                className={styles.imageButton}
                onClick={() => setIsImageModalOpen(true)}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="8" fill="#F2FBFF" />
                  <path
                    d="M8 20H32M20 8V32"
                    stroke="#006383"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className={styles.imageButton}
                onClick={() => setIsImageModalOpen(true)}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="8" fill="#F2FBFF" />
                  <path
                    d="M23.945 9.38202L22.8327 10.4944L12.6078 20.718C11.9155 21.4116 11.5687 21.7584 11.2711 22.14C10.92 22.5905 10.6186 23.0777 10.3723 23.5931C10.1647 24.0299 10.0099 24.4955 9.70033 25.4242L8.38758 29.3613L8.06599 30.3237C7.99077 30.548 7.97961 30.7889 8.03377 31.0192C8.08792 31.2495 8.20524 31.4602 8.37255 31.6275C8.53985 31.7948 8.7505 31.9121 8.98082 31.9662C9.21115 32.0204 9.45201 32.0092 9.67633 31.934L10.6387 31.6124L14.5758 30.2997C15.5057 29.9901 15.9701 29.8353 16.4069 29.6277C16.9245 29.3813 17.4089 29.0817 17.86 28.7289C18.2416 28.4313 18.5884 28.0845 19.2808 27.3922L29.5056 17.1673L30.618 16.055C31.5029 15.1701 32 13.9699 32 12.7185C32 11.4671 31.5029 10.2669 30.618 9.38202C29.7331 8.49713 28.5329 8 27.2815 8C26.0301 8 24.8299 8.49713 23.945 9.38202Z"
                    stroke="#006383"
                    strokeWidth="2"
                  />
                  <path
                    opacity="0.5"
                    d="M22.832 10.4912C22.832 10.4912 22.9712 12.8551 25.0568 14.9407C27.1423 17.0262 29.505 17.1642 29.505 17.1642M10.6381 31.6105L8.38696 29.3593"
                    stroke="#006383"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              {editingField === "article" ? (
                <>
                  <input
                    className={styles.smallInput}
                    value={article}
                    placeholder="Арт. a000000"
                    onChange={(e) => setArticle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit();
                      }
                    }}
                  />

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={saveEdit}
                  >
                    <CheckIcon />
                  </button>

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={deleteArticle}
                  >
                    <TrashIcon />
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.infoText}>
                    {article || "Арт. a000000"}
                  </span>

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => startEdit("article")}
                  >
                    <EditIcon />
                  </button>

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={deleteArticle}
                  >
                    <TrashIcon />
                  </button>
                </>
              )}
            </div>

            <div className={styles.infoRow}>
              {editingField === "price" ? (
                <>
                  <input
                    className={styles.smallInput}
                    value={price}
                    placeholder="80 000₽"
                    onChange={(e) => setPrice(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit();
                      }
                    }}
                  />

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={saveEdit}
                  >
                    <CheckIcon />
                  </button>

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={deletePrice}
                  >
                    <TrashIcon />
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.price}>{price || "80 000₽"}</span>

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => startEdit("price")}
                  >
                    <EditIcon />
                  </button>

                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={deletePrice}
                  >
                    <TrashIcon />
                  </button>
                </>
              )}
            </div>

            <div className={styles.paramsHeader}>
              <h2 className={styles.paramsTitle}>Параметры</h2>

              <button
                type="button"
                className={styles.iconButton}
                onClick={addParam}
              >
                <EditIcon />
              </button>

              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setParams([])}
              >
                <TrashIcon />
              </button>
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={addParam}
            >
              <PlusIcon />
              <span>Добавить параметр</span>
            </button>

            <div className={styles.paramsList}>
              {params.map((param, index) => (
                <div key={index} className={styles.paramItem}>
                  {editingField === `param-${index}` ? (
                    <>
                      <input
                        className={styles.paramInput}
                        value={param}
                        onChange={(e) => changeParam(index, e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit();
                          }
                        }}
                      />

                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={saveEdit}
                      >
                        <CheckIcon />
                      </button>

                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => deleteParam(index)}
                      >
                        <TrashIcon />
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{param}</p>

                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => startEdit(`param-${index}`)}
                      >
                        <EditIcon />
                      </button>

                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => deleteParam(index)}
                      >
                        <TrashIcon />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => {
              setTitle("");
              setArticle("");
              setPrice("");
              setParams([]);
              setImages([]);
              setEditingField(null);
            }}
          >
            Удалить
          </button>
        </div>

        {isImageModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeImageModal}
              >
                ×
              </button>

              <h2 className={styles.modalTitle}>Загрузить изображение</h2>

              <label
                className={`${styles.uploadArea} ${
                  isDragging ? styles.uploadAreaDragging : ""
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept="image/webp"
                  className={styles.fileInput}
                  onChange={handleImageInputChange}
                />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Предпросмотр"
                    className={styles.imagePreview}
                  />
                ) : (
                  <>
                    <svg
                      width="72"
                      height="63"
                      viewBox="0 0 72 63"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M58.979 44.1567H54.3834C53.9605 44.1567 53.6174 43.8157 53.6174 43.3953C53.6174 42.975 53.9604 42.634 54.3834 42.634H58.979C65.314 42.634 70.4684 37.5105 70.4684 31.2136C70.4684 24.9167 65.314 19.7933 58.979 19.7933H58.8685C58.6464 19.7933 58.4352 19.6976 58.2897 19.5306C58.1442 19.3636 58.0785 19.1423 58.1102 18.9237C58.1786 18.4495 58.2131 17.9731 58.2131 17.5092C58.2131 12.0519 53.7459 7.6115 48.2556 7.6115C46.1197 7.6115 44.0828 8.27497 42.3648 9.53065C41.9873 9.80638 41.4511 9.68402 41.2328 9.27124C36.3674 0.0621164 23.6594 -1.17458 17.071 6.83656C14.2955 10.2115 13.205 14.6018 14.0789 18.8808C14.1752 19.3533 13.8113 19.7939 13.3282 19.7939H13.0213C6.68636 19.7939 1.53198 24.9173 1.53198 31.2142C1.53198 37.5111 6.68636 42.6346 13.0213 42.6346H17.617C18.0399 42.6346 18.3829 42.9755 18.3829 43.3959C18.3829 43.8163 18.0399 44.1573 17.617 44.1573H13.0213C5.84151 44.1573 0 38.3509 0 31.2142C0 24.2777 5.51811 18.5979 12.42 18.2847C11.7717 13.8453 13.0115 9.36747 15.8848 5.87291C22.9387 -2.70485 36.4569 -1.7434 42.1714 7.82143C43.9944 6.68537 46.0805 6.0894 48.2554 6.0894C54.9071 6.0894 60.178 11.7169 59.7168 18.2918C66.5551 18.673 72 24.3228 72 31.2136C72 38.3509 66.1585 44.1567 58.9787 44.1567L58.979 44.1567Z"
                        fill="#006383"
                      />
                      <path
                        d="M35.8977 23.7812C46.5384 23.7814 55.1965 32.3867 55.1965 42.9658C55.1965 53.5448 46.5384 62.1502 35.8977 62.1504C25.257 62.1504 16.5979 53.545 16.5979 42.9658C16.5979 32.3867 25.2568 23.7812 35.8977 23.7812ZM35.8977 25.6045C26.2658 25.6045 18.4309 33.394 18.4309 42.9658C18.4309 52.5377 26.2659 60.3271 35.8977 60.3271C45.5293 60.327 53.3645 52.5375 53.3645 42.9658C53.3645 33.394 45.5293 25.6047 35.8977 25.6045Z"
                        fill="#006383"
                      />
                      <path
                        d="M36.2473 35.4277C36.6389 35.4277 36.9583 35.7443 36.9583 36.1357V50.6279C36.9583 51.0198 36.6389 51.3359 36.2473 51.3359C35.8558 51.3358 35.5364 51.0193 35.5364 50.6279V36.1357C35.5364 35.7444 35.8558 35.4279 36.2473 35.4277Z"
                        fill="#006383"
                      />
                      <path
                        d="M35.7454 35.6367C36.0225 35.3611 36.4718 35.3613 36.7493 35.6367L41.2356 40.0957C41.5137 40.3721 41.5137 40.8212 41.2356 41.0977C41.0958 41.2349 40.9144 41.3037 40.7336 41.3037C40.5526 41.3037 40.3703 41.2352 40.2317 41.0977L36.2473 37.1367L32.2639 41.0977C31.9867 41.3736 31.5366 41.3733 31.259 41.0977C30.9809 40.8212 30.9809 40.3721 31.259 40.0957L35.7454 35.6367Z"
                        fill="#006383"
                      />
                    </svg>

                    <p>Перетащите или прикрепите файл</p>
                    <span>Только формат .webp</span>
                  </>
                )}
              </label>

              <button
                type="button"
                className={styles.modalSave}
                onClick={uploadImage}
                disabled={imageLoading}
              >
                {imageLoading ? "Загрузка..." : "Сохранить"}
              </button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}

export default Create;