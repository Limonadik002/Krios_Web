import { useEffect, useState } from "react";
import styles from "./ProductForm.module.css";

function ImageUploadModal({ isOpen, onClose, onSave, loading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!isOpen) return null;

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "image/webp") {
      setLocalError("Можно загружать только изображения в формате WebP");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setLocalError("");
  };

  const handleSave = async () => {
    if (!file) {
      setLocalError("Сначала выберите изображение");
      return;
    }

    await onSave(file);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.modalClose} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.modalTitle}>Загрузить изображение</h2>

        {localError && <p className={styles.formError}>{localError}</p>}

        <label
          className={`${styles.uploadArea} ${
            isDragging ? styles.uploadAreaDragging : ""
          }`}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <input
            type="file"
            accept="image/webp"
            className={styles.fileInput}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          {preview ? (
            <img src={preview} alt="Предпросмотр" className={styles.imagePreview} />
          ) : (
            <p>Перетащите или прикрепите файл</p>
          )}
        </label>

        <button
          type="button"
          className={styles.modalSave}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

export default ImageUploadModal;