import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { PropertyWithImages } from "../types/PropertyResponse";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";

const HostPropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "HOST") {
      navigate("/unauthorized");
      return;
    }

    const fetchProperties = async () => {
      try {
        const res = await api.get<PropertyWithImages[]>(`/properties?ownerId=${user.id}`);
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-pink-600">Twoje nieruchomości</h1>
          <button
            onClick={() => navigate("/property-form")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow"
          >
            ➕ Dodaj nieruchomość
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {properties.length === 0 ? (
            <p className="text-gray-500">Nie dodałeś jeszcze żadnej nieruchomości.</p>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className="bg-cyan-100 p-4 rounded-lg shadow border border-pink-300 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/host/properties/${property.id}/bookings`)}

              >
                <h2 className="text-lg font-semibold text-pink-600">{property.name}</h2>
                <p className="text-gray-700">
                  {property.address.city}, {property.address.country}
                </p>
                <p className="text-sm text-gray-500">{property.pricePerNight} $ / noc</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HostPropertiesPage;
