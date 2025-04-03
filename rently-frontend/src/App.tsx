import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RegisterUserPage from "./pages/RegisterUser";
import RegisterHostPage from "./pages/RegisterHost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registerHost" element={<RegisterHostPage />} />
        <Route path="/register" element={<RegisterUserPage />} />
      </Routes>
    </Router>
  );
}

export default App;