import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Logo from "../component/Logo";

const PropertyFormPage = () => {
  const [formData, setFormData] = useState({
    propertyType: "",
    name: "",
    description: "",
    maxNumberOfGuests: "",
    pricePerNight: "",
    address: {
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      localNumber: "",
      postalCode: ""
    }
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        maxNumberOfGuests: parseInt(formData.maxNumberOfGuests),
        pricePerNight: parseFloat(formData.pricePerNight)
      };
      
      await api.post("/properties", payload);
      navigate("/properties");
    } catch (err: any) {
      setError(err.response?.data?.message || "Wystąpił błąd podczas dodawania nieruchomości");
    } finally {
      setIsLoading(false);
    }
  };

  const propertyTypes = [
    "APARTMENT",
    "HOUSE",
    "ROOM"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Dodaj nową nieruchomość</h2>
            <p className="text-gray-600 text-center mb-8">Wypełnij formularz, aby dodać nową ofertę</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                    Typ nieruchomości *
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  >
                    <option value="">Wybierz typ</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa nieruchomości *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Np. Przytulne mieszkanie w centrum"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Opis *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Opisz swoją nieruchomość..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxNumberOfGuests" className="block text-sm font-medium text-gray-700 mb-1">
                    Maksymalna liczba gości *
                  </label>
                  <input
                    id="maxNumberOfGuests"
                    type="number"
                    name="maxNumberOfGuests"
                    min="1"
                    placeholder="Np. 4"
                    value={formData.maxNumberOfGuests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-1">
                    Cena za noc (PLN) *
                  </label>
                  <input
                    id="pricePerNight"
                    type="number"
                    name="pricePerNight"
                    min="0"
                    step="0.01"
                    placeholder="Np. 200.00"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Adres nieruchomości</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Kraj *
                    </label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      placeholder="Np. Polska"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Miasto *
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="Np. Warszawa"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Ulica *
                    </label>
                    <input
                      id="street"
                      type="text"
                      name="street"
                      placeholder="Np. Marszałkowska"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Numer domu *
                    </label>
                    <input
                      id="houseNumber"
                      type="text"
                      name="houseNumber"
                      placeholder="Np. 15"
                      value={formData.address.houseNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="localNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Numer lokalu
                    </label>
                    <input
                      id="localNumber"
                      type="text"
                      name="localNumber"
                      placeholder="Np. 12"
                      value={formData.address.localNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Kod pocztowy *
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    placeholder="Np. 00-001"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm text-center me-2 mb-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Zapisywanie...
                    </span>
                  ) : (
                    "Dodaj nieruchomość"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormPage;