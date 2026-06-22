import styles from "./ProductForm.module.css";
import { CheckIcon, EditIcon, TrashIcon } from "./icons";

function EditableField({
  name,
  value,
  onChange,
  fallback,
  placeholder,
  editingField,
  startEdit,
  saveEdit,
  onDelete,
  displayClassName,
  inputClassName,
  as = "span",
}) {
  const isEditing = editingField === name;
  const Tag = as;

  if (isEditing) {
    return (
      <>
        <input
          className={inputClassName}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              saveEdit();
            }
          }}
        />

        <button type="button" className={styles.iconButton} onClick={saveEdit}>
          <CheckIcon />
        </button>

        <button type="button" className={styles.iconButton} onClick={onDelete}>
          <TrashIcon />
        </button>
      </>
    );
  }

  return (
    <>
      <Tag className={displayClassName}>{value || fallback}</Tag>

      <button
        type="button"
        className={styles.iconButton}
        onClick={() => startEdit(name)}
      >
        <EditIcon />
      </button>

      <button type="button" className={styles.iconButton} onClick={onDelete}>
        <TrashIcon />
      </button>
    </>
  );
}

export default EditableField;