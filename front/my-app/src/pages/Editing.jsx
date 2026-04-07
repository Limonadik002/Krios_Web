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

export function Editing() {
  const params = ["Параметр 1", "Параметр 2", "Параметр 3"];

  return (
    <section className={styles.editing}>
      

      <button type="button" className={styles.backButton}>
        Вернуться назад
      </button>

      <form className={styles.form}>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>Название товара</h1>
          <button type="button" className={styles.iconButton}>
            <EditIcon />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.gallery}>
            <div className={styles.previewList}>
              <div className={styles.previewThumb}></div>
              <div className={styles.previewThumb}></div>
              <div className={styles.previewThumb}></div>
              <div className={styles.previewThumb}></div>
              <div className={styles.previewThumb}></div>
            </div>

            <div className={styles.mainImage}></div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.infoText}>Арт. а000000</span>
              <button type="button" className={styles.iconButton}>
                <EditIcon />
              </button>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.price}>80 000₽</span>
              <button type="button" className={styles.iconButton}>
                <EditIcon />
              </button>
            </div>

            <div className={styles.paramsHeader}>
              <h2 className={styles.paramsTitle}>Параметры</h2>
              <button type="button" className={styles.iconButton}>
                <EditIcon />
              </button>
            </div>

            <button type="button" className={styles.addButton}>
              <PlusIcon />
              <span>Добавить параметр</span>
            </button>

            <div className={styles.paramsList}>
              {params.map((param, index) => (
                <div key={index} className={styles.paramItem}>
                  <p>{param}</p>
                  <button type="button" className={styles.iconButton}>
                    <EditIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            Сохранить
          </button>
          <button type="button" className={styles.deleteButton}>
            Удалить
          </button>
        </div>
      </form>
    </section>
  );
}