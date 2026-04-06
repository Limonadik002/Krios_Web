import { useNavigate } from "react-router-dom";

function AddProductPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={() => navigate("/Admin")}>Назад</button>
      <h2>Добавить товар</h2>
    </div>
  );
}

export default AddProductPage;