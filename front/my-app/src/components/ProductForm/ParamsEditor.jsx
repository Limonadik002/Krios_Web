import styles from "./ProductForm.module.css";
import { PlusIcon } from "./icons";
import EditableField from "./EditableField";

function ParamsEditor({
  params,
  editingField,
  startEdit,
  saveEdit,
  addParam,
  changeParam,
  deleteParam,
}) {
  return (
    <>
      <div className={styles.paramsHeader}>
        <h2 className={styles.paramsTitle}>Параметры</h2>
      </div>

      <button type="button" className={styles.addButton} onClick={addParam}>
        <PlusIcon />
        <span>Добавить параметр</span>
      </button>

      <div className={styles.paramsList}>
        {params.map((param, index) => (
          <div key={index} className={styles.paramItem}>
            <EditableField
              name={`param-${index}`}
              value={param}
              onChange={(value) => changeParam(index, value)}
              fallback={`Параметр ${index + 1}`}
              editingField={editingField}
              startEdit={startEdit}
              saveEdit={saveEdit}
              onDelete={() => deleteParam(index)}
              displayClassName={styles.paramText}
              inputClassName={styles.paramInput}
              as="p"
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ParamsEditor;