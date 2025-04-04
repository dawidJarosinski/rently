import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Logo from "../component/Logo";

interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const RegisterHostPage = () => {
  const [formData, setFormData] = useState<RegisterForm>({ 
    email: "", 
    password: "", 
    firstName: "", 
    lastName: "" 
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        role: "HOST"
      };
      await api.post("/register", payload);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Rejestracja nie powiodła się");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Zarejestruj się</h2>
            <p className="text-gray-600 text-center mb-8">Jako właściciel nieruchomości</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Imię
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Jan"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwisko
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Kowalski"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="podaj@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Hasło
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 6 znaków</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Rejestracja jako właściciel</h3>
                <p className="text-sm text-blue-700">
                  Po rejestracji będziesz mógł zarządzać swoimi nieruchomościami i wynajmować je użytkownikom.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm text-center me-2 mb-2 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Rejestracja...
                  </span>
                ) : (
                  "Zarejestruj się jako właściciel"
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Masz już konto?{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Zaloguj się
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterHostPage;