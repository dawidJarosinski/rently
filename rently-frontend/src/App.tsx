import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import RegisterUserPage from "./pages/RegisterUser";
import RegisterHostPage from "./pages/RegisterHost";
import PropertyFormPage from "./pages/PropertyFormPage";
import HomePage from "./pages/HomePage";
import HostPropertiesPage from "./pages/HostPropertiesPage";
import AdminPropertiesPage from "./pages/AdminPropertiesPage";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-host" element={<RegisterHostPage />} />
        <Route path="/register" element={<RegisterUserPage />} />
        <Route path="/property-form" element={<PropertyFormPage />} />
        <Route path="/host/properties" element={<HostPropertiesPage />} />
        <Route path="/admin/properties" element={<AdminPropertiesPage />} />
      </Routes>
    </Router>
  );
}

export default App;