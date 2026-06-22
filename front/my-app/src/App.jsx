import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import AdminPage from "./admin/AdminPage";
import CatalogPage from "./admin/CatalogPage";
import AddProductPage from "./admin/Create";
import Home from "./pages/Home";
import Editing from "./admin/Editing";
import Register from "./admin/Register";
import { isAuthenticated } from "./auth";


function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/Admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/Catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
        <Route path="/Add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
        <Route path="/Editing/:art" element={<ProtectedRoute><Editing /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;