import { useEffect, useMemo, useState } from "react";
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

const DeleteIcon = () => (
  <svg
    width="22"
    height="28"
    viewBox="0 0 22 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 4.71429H2.66667L4.33333 27H17.6667L19.3333 4.71429H1M11 10.2857V21.4286M15.1667 10.2857L14.3333 21.4286M6.83333 10.2857L7.66667 21.4286M7.66667 4.71429L8.5 1H13.5L14.3333 4.71429"
      stroke="#006383"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Editing() {
  const [title, setTitle] = useState("Название товара");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [article, setArticle] = useState("Арт. a000000");
  const [isEditingArticle, setIsEditingArticle] = useState(false);

  const [price, setPrice] = useState("80 000₽");
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const [paramsTitle, setParamsTitle] = useState("Параметры");
  const [isEditingParamsTitle, setIsEditingParamsTitle] = useState(false);

  const [params, setParams] = useState([]);
  const [editingParamIndex, setEditingParamIndex] = useState(null);

  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const [version, setVersion] = useState(1);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [cardDeleteModalOpen, setCardDeleteModalOpen] = useState(false);

  const clearArticle = useMemo(() => {
    return article.replace("Арт. ", "").trim();
  }, [article]);

  useEffect(() => {
    fetchObjects();
  }, []);

  const getErrorText = async (response) => {
    try {
      const text = await response.text();
      return text || `Ошибка сервера: ${response.status}`;
    } catch {
      return `Ошибка сервера: ${response.status}`;
    }
  };

  const fetchObjects = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`/api/GetObjects?page=1&limit=20`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await getErrorText(response));
      }

      const data = await response.json();
      const obj = Array.isArray(data) ? data[0] : data;

      if (!obj) return;

      setTitle(obj.name || "");
      setArticle(obj.article ? `Арт. ${obj.article}` : "");
      setPrice(
        typeof obj.price === "number"
          ? `${obj.price.toLocaleString("ru-RU")}₽`
          : ""
      );
      setParamsTitle(obj.parametrs_name || "Параметры");
      setParams(obj.characteristics ? Object.values(obj.characteristics) : []);
      setPhotos(Array.isArray(obj.photos) ? obj.photos : []);
      setSelectedPhotoIndex(0);
      setVersion(obj.version ?? 1);
    } catch (error) {
      console.error("Ошибка загрузки товара:", error);
      setMessage(error.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (index, value) => {
    const updatedParams = [...params];
    updatedParams[index] = value;
    setParams(updatedParams);
  };

  const handleAddParam = () => {
    setParams([...params, ""]);
    setEditingParamIndex(params.length);
  };

  const openDeleteModal = (target) => {
    setDeleteTarget(target);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    switch (deleteTarget.type) {
      case "title":
        setTitle("");
        setIsEditingTitle(false);
        break;
      case "article":
        setArticle("");
        setIsEditingArticle(false);
        break;
      case "price":
        setPrice("");
        setIsEditingPrice(false);
        break;
      case "paramsTitle":
        setParamsTitle("");
        setIsEditingParamsTitle(false);
        break;
      case "param":
        setParams((prev) => prev.filter((_, i) => i !== deleteTarget.index));
        if (editingParamIndex === deleteTarget.index) {
          setEditingParamIndex(null);
        } else if (
          editingParamIndex !== null &&
          editingParamIndex > deleteTarget.index
        ) {
          setEditingParamIndex(editingParamIndex - 1);
        }
        break;
      default:
        break;
    }

    closeDeleteModal();
  };

  const openSaveModal = () => {
    setSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setSaveModalOpen(false);
  };

  const openCardDeleteModal = () => {
    setCardDeleteModalOpen(true);
  };

  const closeCardDeleteModal = () => {
    setCardDeleteModalOpen(false);
  };

  const buildCharacteristics = () => {
    return params.reduce((acc, item, index) => {
      if (item?.trim()) {
        acc[`param_${index + 1}`] = item.trim();
      }
      return acc;
    }, {});
  };

  const buildCreatePayload = () => {
    return {
      article: clearArticle,
      name: title.trim(),
      price: Number(String(price).replace(/[^\d.]/g, "")) || 0,
      parametrs_name: paramsTitle.trim(),
      characteristics: buildCharacteristics(),
      photos: [],
    };
  };

  const buildUpdatePayload = () => {
    return {
      article: clearArticle,
      name: title.trim(),
      price: Number(String(price).replace(/[^\d.]/g, "")) || 0,
      parametrs_name: paramsTitle.trim(),
      characteristics: buildCharacteristics(),
      version,
    };
  };

  const createObject = async () => {
    try {
      setMessage("");

      const payload = buildCreatePayload();

      const response = await fetch(`/api/CreateNewObj`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getErrorText(response));
      }

      setMessage("Объект создан");
      await fetchObjects();
    } catch (error) {
      console.error("Ошибка создания:", error);
      setMessage(error.message || "Не удалось создать объект");
    }
  };

  const confirmSave = async () => {
    try {
      setMessage("");

      const payload = buildUpdatePayload();

      const response = await fetch(`/api/UpdateObj`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getErrorText(response));
      }

      setSaveModalOpen(false);
      setMessage("Изменения сохранены");
      setVersion((prev) => prev + 1);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      setMessage(error.message || "Не удалось сохранить");
    }
  };

  const confirmCardDelete = async () => {
    try {
      setMessage("");

      const response = await fetch(
        `/api/DeleteObj?articule=${encodeURIComponent(clearArticle)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorText(response));
      }

      setCardDeleteModalOpen(false);
      setMessage("Карточка удалена");

      setTitle("");
      setArticle("");
      setPrice("");
      setParamsTitle("Параметры");
      setParams([]);
      setPhotos([]);
      setSelectedPhotoIndex(0);
      setVersion(1);
    } catch (error) {
      console.error("Ошибка удаления:", error);
      setMessage(error.message || "Не удалось удалить карточку");
    }
  };

  const handleUploadPhotos = async () => {
    setMessage("Загрузка фото сейчас недоступна: CORS на стороне хранилища");
  };

  return (
    <section className={styles.editing}>
      <div className={styles.topActions}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => window.history.back()}
        >
          Вернуться назад
        </button>

        <button
          type="button"
          className={styles.createButton}
          onClick={createObject}
        >
          Создать объект
        </button>
      </div>

      {message && <div className={styles.message}>{message}</div>}
      {loading && <div className={styles.message}>Загрузка...</div>}

      <form className={styles.form}>
        <div className={styles.titleRow}>
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setIsEditingTitle(false);
                }
              }}
              className={styles.titleInput}
              autoFocus
            />
          ) : (
            <h1 className={styles.pageTitle}>{title}</h1>
          )}

          <div className={styles.iconGroup}>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.titleEditButton}`}
              onClick={() => setIsEditingTitle((prev) => !prev)}
              aria-label={
                isEditingTitle ? "Подтвердить название" : "Редактировать название"
              }
            >
              {isEditingTitle ? <CheckIcon /> : <EditIcon />}
            </button>

            <button
              type="button"
              className={styles.iconButton}
              onClick={() => openDeleteModal({ type: "title" })}
              aria-label="Удалить название"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.gallery}>
            <div className={styles.previewList}>
              {photos.length > 0 ? (
                photos.map((photo, index) => (
                  <button
                    key={`${photo.url_photos}-${index}`}
                    type="button"
                    className={`${styles.previewThumb} ${
                      selectedPhotoIndex === index ? styles.previewThumbActive : ""
                    }`}
                    onClick={() => setSelectedPhotoIndex(index)}
                  >
                    <img src={photo.url_photos} alt={`preview-${index}`} />
                  </button>
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
              {photos[selectedPhotoIndex]?.url_photos ? (
                <img
                  src={photos[selectedPhotoIndex].url_photos}
                  alt={title}
                  className={styles.mainImageTag}
                />
              ) : null}
            </div>

            <label className={styles.uploadLabel}>
              Загрузить фото
              <input
                type="file"
                multiple
                className={styles.hiddenInput}
                onChange={() => handleUploadPhotos()}
              />
            </label>
          </div>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              {isEditingArticle ? (
                <input
                  type="text"
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  onBlur={() => setIsEditingArticle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setIsEditingArticle(false);
                    }
                  }}
                  className={styles.infoInput}
                  autoFocus
                />
              ) : (
                <span className={styles.infoText}>{article}</span>
              )}

              <div className={styles.iconGroup}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setIsEditingArticle((prev) => !prev)}
                  aria-label={
                    isEditingArticle
                      ? "Подтвердить артикул"
                      : "Редактировать артикул"
                  }
                >
                  {isEditingArticle ? <CheckIcon /> : <EditIcon />}
                </button>

                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => openDeleteModal({ type: "article" })}
                  aria-label="Удалить артикул"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <div className={styles.infoRow}>
              {isEditingPrice ? (
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => setIsEditingPrice(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setIsEditingPrice(false);
                    }
                  }}
                  className={styles.infoInput}
                  autoFocus
                />
              ) : (
                <span className={styles.price}>{price}</span>
              )}

              <div className={styles.iconGroup}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setIsEditingPrice((prev) => !prev)}
                  aria-label={
                    isEditingPrice ? "Подтвердить цену" : "Редактировать цену"
                  }
                >
                  {isEditingPrice ? <CheckIcon /> : <EditIcon />}
                </button>

                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => openDeleteModal({ type: "price" })}
                  aria-label="Удалить цену"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <div className={styles.paramsHeader}>
              {isEditingParamsTitle ? (
                <input
                  type="text"
                  value={paramsTitle}
                  onChange={(e) => setParamsTitle(e.target.value)}
                  onBlur={() => setIsEditingParamsTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setIsEditingParamsTitle(false);
                    }
                  }}
                  className={styles.paramsTitleInput}
                  autoFocus
                />
              ) : (
                <h2 className={styles.paramsTitle}>{paramsTitle}</h2>
              )}

              <div className={styles.iconGroup}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setIsEditingParamsTitle((prev) => !prev)}
                  aria-label={
                    isEditingParamsTitle
                      ? "Подтвердить заголовок параметров"
                      : "Редактировать заголовок параметров"
                  }
                >
                  {isEditingParamsTitle ? <CheckIcon /> : <EditIcon />}
                </button>

                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => openDeleteModal({ type: "paramsTitle" })}
                  aria-label="Удалить заголовок параметров"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddParam}
            >
              <PlusIcon />
              <span>Добавить параметр</span>
            </button>

            <div className={styles.paramsList}>
              {params.map((param, index) => (
                <div key={index} className={styles.paramItem}>
                  {editingParamIndex === index ? (
                    <input
                      type="text"
                      value={param}
                      onChange={(e) => handleParamChange(index, e.target.value)}
                      onBlur={() => setEditingParamIndex(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setEditingParamIndex(null);
                        }
                      }}
                      className={styles.paramInput}
                      autoFocus
                    />
                  ) : (
                    <p>{param || "Новый параметр"}</p>
                  )}

                  <div className={styles.iconGroup}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() =>
                        setEditingParamIndex(
                          editingParamIndex === index ? null : index
                        )
                      }
                      aria-label={
                        editingParamIndex === index
                          ? "Подтвердить параметр"
                          : "Редактировать параметр"
                      }
                    >
                      {editingParamIndex === index ? <CheckIcon /> : <EditIcon />}
                    </button>

                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => openDeleteModal({ type: "param", index })}
                      aria-label="Удалить параметр"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={openSaveModal}
          >
            Сохранить
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={openCardDeleteModal}
          >
            Удалить
          </button>
        </div>
      </form>

      {deleteModalOpen && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Вы уверены в удалении?</h3>
            <p className={styles.modalText}>
              Вы не сможете восстановить поле после удаления!
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={closeDeleteModal}
              >
                Отмена
              </button>

              <button
                type="button"
                className={styles.confirmDeleteButton}
                onClick={confirmDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {saveModalOpen && (
        <div className={styles.modalOverlay} onClick={closeSaveModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Сохранить изменения?</h3>
            <p className={styles.modalText}>
              Если вы не сохраните, изменения будут потеряны!
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.confirmSaveButton}
                onClick={confirmSave}
              >
                Сохранить
              </button>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={closeSaveModal}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {cardDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={closeCardDeleteModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Вы уверены в удалении?</h3>
            <p className={styles.modalText}>
              Вы не сможете восстановить карточку после удаления!
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={closeCardDeleteModal}
              >
                Отмена
              </button>

              <button
                type="button"
                className={styles.confirmDeleteButton}
                onClick={confirmCardDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}