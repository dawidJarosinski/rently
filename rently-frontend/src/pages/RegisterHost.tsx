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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Załóż konto</h2>
            <p className="text-gray-500 text-center mb-6">dla właściciela nieruchomości</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">Imię</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Jan"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Nazwisko</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Kowalski"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="podaj@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Hasło</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 6 znaków</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-sm text-blue-800">
                <h3 className="font-semibold mb-1">Dlaczego warto?</h3>
                <p>Zarządzaj swoimi nieruchomościami i wynajmuj je użytkownikom z całego świata.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br font-medium rounded-lg shadow-md transition ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                      />
                    </svg>
                    Rejestracja...
                  </span>
                ) : (
                  "Zarejestruj się jako właściciel"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Masz już konto?{" "}
                <a href="/login" className="text-blue-600 hover:underline font-medium">
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
