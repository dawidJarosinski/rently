import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { PropertyResponse } from "../types/PropertyResponse";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";
import { Home, MapPin, DollarSign, PlusCircle } from "lucide-react";

const HostPropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "HOST") {
      navigate("/unauthorized");
      return;
    }

    const fetchProperties = async () => {
      try {
        const res = await api.get<PropertyResponse[]>(`/properties?ownerId=${user.id}`);
        setProperties(res.data);
      } catch (err) {
        console.error("Błąd podczas pobierania nieruchomości hosta:", err);
      }
    };

    fetchProperties();
  }, [user, navigate]);

  if (!user || user.role !== "HOST") return null;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-pink-600 flex items-center gap-2">
            <Home className="w-6 h-6" /> Twoje nieruchomości
          </h1>
          <button
            onClick={() => navigate("/property-form")}
            className="bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] text-white px-5 py-2.5 rounded-full shadow hover:brightness-105 transition flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" /> Dodaj nieruchomość
          </button>
        </div>

        {properties.length === 0 ? (
          <p className="text-gray-500 mt-20 text-center">Nie dodałeś jeszcze żadnej nieruchomości.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => navigate(`/host/properties/${property.id}/bookings`)}
                className="bg-cyan-100 p-4 rounded-xl shadow border border-pink-300 hover:shadow-md cursor-pointer transition"
              >
                <h2 className="text-lg font-semibold text-pink-600 flex items-center gap-2">
                  <Home className="w-5 h-5" /> {property.name}
                </h2>
                <p className="text-gray-700 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  {property.address.city}, {property.address.country}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  {property.pricePerNight} zł / noc
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HostPropertiesPage;
