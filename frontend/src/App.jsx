import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div>
          <p className="eyebrow">Café</p>
          <h1>Binary Brews</h1>
        </div>
        <nav>
          <NavLink to="/customer">Customer</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/customer" replace />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}
