import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { PropertyResponse } from "../types/PropertyResponse";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";
import { ShieldCheck, Check, X } from "lucide-react";

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/unauthorized");
      return;
    }

    const fetchUnapproved = async () => {
      try {
        const res = await api.get<PropertyResponse[]>("/admin/properties?approve=false");
        setProperties(res.data);
      } catch (err) {
        console.error("Błąd podczas pobierania nieruchomości:", err);
      }
    };

    fetchUnapproved();
  }, [user, navigate]);

  const handleApprove = async (propertyId: string) => {
    try {
      await api.patch(`/admin/properties/${propertyId}/approve`);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error("Błąd podczas zatwierdzania:", err);
    }
  };

  const handleDecline = async (propertyId: string) => {
    try {
      await api.delete(`/admin/properties/${propertyId}/decline`);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error("Błąd podczas odrzucania:", err);
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-6 h-6 text-pink-600" />
          <h1 className="text-3xl font-bold text-pink-600">
            Nieruchomości do zatwierdzenia
          </h1>
        </div>

        {properties.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Brak nieruchomości do zatwierdzenia.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-pink-300 shadow-sm p-5 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="cursor-pointer"
                  >
                    <h2 className="text-xl font-semibold text-pink-600">
                      {property.name}
                    </h2>
                    <p className="text-gray-700">
                      {property.address.city}, {property.address.country}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {property.pricePerNight} zł / noc
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(property.id)}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow"
                    >
                      <Check className="w-4 h-4" /> Zatwierdź
                    </button>
                    <button
                      onClick={() => handleDecline(property.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow"
                    >
                      <X className="w-4 h-4" /> Odrzuć
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPropertiesPage;
