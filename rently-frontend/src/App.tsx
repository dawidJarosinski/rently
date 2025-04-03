import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import RegisterUserPage from "./pages/RegisterUser";
import RegisterHostPage from "./pages/RegisterHost";
import PropertyFormPage from "./pages/PropertyFormPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registerHost" element={<RegisterHostPage />} />
        <Route path="/register" element={<RegisterUserPage />} />
        <Route path="/propertyForm" element={<PropertyFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;