import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ROUTES } from "../api";
import { authHeader } from "../auth";
import styles from "./Editing.module.css";

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

function Editing() {
  const { art } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [price, setPrice] = useState("");
  const [params, setParams] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [mainPhoto, setMainPhoto] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setMainPhoto(event.target.result);
    reader.readAsDataURL(file);

    try {
      const presignRes = await fetch(API_ROUTES.getPresignedUrls(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ filenames: [file.name] }),
      });
      
      if (!presignRes.ok) throw new Error('Ошибка получения ссылки');
      
      const presignData = await presignRes.json();
      const { url_write, url_read, key } = presignData.items[0];
      const fixedUrlRead = url_read.replace('//be6f59da-krios', '/be6f59da-krios');
      
      await fetch(url_write, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'image/webp' },
      });
      
      setMainPhoto(fixedUrlRead);
      setPhotos(prev => [...prev, { url_photos: fixedUrlRead, key, position: prev.length + 1 }]);
      
    } catch (err) {
      console.error('Ошибка загрузки фото:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_ROUTES.getProductByArt(art), {
          headers: { ...authHeader() },
        });

        if (!response.ok) {
          throw new Error("Не удалось загрузить товар");
        }

        const product = await response.json();

        setTitle(product.title || product.name || "");
        setArticle(product.article || product.vendor_code || "");
        setPrice(product.price || "");
        setParams(product.params || product.parameters || []);
        setPhotos(product.photos || []);
        setMainPhoto(product.main_photo || product.photo || (product.photos && product.photos[0]?.url_photos) || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (art) fetchProduct();
  }, [art]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
  name: title,
  article: article,
  price: parseFloat(price) || 0,
  parametrs_name: params.join(", "),
  photos: photos.map(p => ({
    url_photos: p.url_photos,
    position: p.position,
    obj_art: article
  })),
};

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_ROUTES.updateProduct(art), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить товар");
      }

      navigate("/Catalog");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_ROUTES.deleteProduct(art), {
        method: "DELETE",
        headers: { ...authHeader() },
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить товар");
      }

      navigate("/Catalog");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Ошибка загрузки товара</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/Catalog")}>Вернуться в каталог</button>
      </div>
    );
  }

  return (
    <section className={styles.editing}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        Вернуться назад
      </button>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.titleRow}>
          {editingField === "title" ? (
            <>
              <input
                className={styles.titleInput}
                value={title}
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
                {title || "Без названия"}
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
              {photos.length > 0 ? (
                photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className={styles.previewThumb}
                    onClick={() => setMainPhoto(photo.url_photos)}
                    style={{ cursor: 'pointer', borderColor: mainPhoto === photo.url_photos ? '#3aa0de' : '#7ea1b0' }}
                  >
                     <img src={photo.url_photos} alt={`Фото ${index + 1}`} />
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
              {mainPhoto ? (
                <img src={mainPhoto} alt={title || "Товар"} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                  Нет фото
                </div>
              )}
              
              <div className={styles.imageActions}>
                <button type="button" className={styles.imageButton} onClick={() => fileInputRef.current?.click()}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12H20M12 4V20" stroke="#006383" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button type="button" className={styles.imageButton} onClick={() => setIsImageModalOpen(true)}>
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                    <path d="M20.3827 4.2036L19.1467 5.4396L7.7854 16.7996C7.01607 17.5703 6.63073 17.9556 6.30007 18.3796C5.90992 18.8802 5.57509 19.4216 5.3014 19.9943C5.07073 20.4796 4.89873 20.9969 4.55473 22.0289L3.09607 26.4036L2.73873 27.4729C2.65515 27.7222 2.64275 27.9898 2.70292 28.2457C2.7631 28.5017 2.89346 28.7357 3.07936 28.9216C3.26526 29.1075 3.49933 29.2379 3.75525 29.2981C4.01117 29.3582 4.2788 29.3458 4.52807 29.2623L5.5974 28.9049L9.97207 27.4463C11.0054 27.1023 11.5214 26.9303 12.0067 26.6996C12.5818 26.4258 13.1201 26.0929 13.6214 25.7009C14.0454 25.3703 14.4307 24.9849 15.2001 24.2156L26.5614 12.8543L27.7974 11.6183C28.7806 10.635 29.333 9.30145 29.333 7.91093C29.333 6.52041 28.7806 5.18684 27.7974 4.2036C26.8142 3.22035 25.4806 2.66797 24.0901 2.66797C22.6995 2.66797 21.366 3.22035 20.3827 4.2036Z" stroke="#006383" strokeWidth="2"/>
                    <path opacity="0.5" d="M19.1464 5.4375C19.1464 5.4375 19.301 8.06417 21.6184 10.3815C23.9357 12.6988 26.561 12.8522 26.561 12.8522M5.59704 28.9042L3.0957 26.4028" stroke="#006383" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              {editingField === "article" ? (
                <>
                  <input
                    className={styles.smallInput}
                    value={article}
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
                    {article || "Артикул не указан"}
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
                  <span className={styles.price}>
                    {price || "Цена не указана"}
                  </span>

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
                        onChange={(e) =>
                          changeParam(index, e.target.value)
                        }
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
          <button type="submit" className={styles.saveButton}>
            Сохранить
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDeleteProduct}
          >
            Удалить
          </button>
        </div>
      </form>
    </section>
  );
}

export default Editing;