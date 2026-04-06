import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import CatalogPage from "./pages/CatalogPage";
import AddProductPage from "./pages/AddProductPage";
import Home from "./pages/Home";
import { Editing } from "./pages/Editing";




function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/editing" element={<Editing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;