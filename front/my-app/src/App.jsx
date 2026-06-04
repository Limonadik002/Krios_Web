import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import CatalogPage from "./pages/CatalogPage";
import AddProductPage from "./pages/Create";
import Home from "./pages/Home";
import Editing from "./pages/Editing";
import Register from "./pages/Register";
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