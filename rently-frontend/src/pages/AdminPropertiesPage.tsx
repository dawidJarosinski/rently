import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { PropertyResponse } from "../types/PropertyResponse";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";

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
        <div className="p-6">
        <h1 className="text-2xl font-bold text-pink-600 mb-6">Nieruchomości do zatwierdzenia</h1>

        {properties.length === 0 ? (
            <p className="text-gray-500">Brak nieruchomości do zatwierdzenia.</p>
        ) : (
            <div className="flex flex-col gap-4">
            {properties.map((property) => (
                <div
                key={property.id}
                className="bg-cyan-100 p-4 rounded-lg shadow border border-pink-300"
                >
                <div className="flex justify-between items-center">
                    <div onClick={() => navigate(`/properties/${property.id}`)} className="cursor-pointer">
                    <h2 className="text-lg font-semibold text-pink-600">{property.name}</h2>
                    <p className="text-gray-700">
                        {property.address.city}, {property.address.country}
                    </p>
                    <p className="text-sm text-gray-500">
                        {property.pricePerNight} $ / noc
                    </p>
                    </div>
                    <div className="flex gap-2">
                    <button
                        onClick={() => handleApprove(property.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                    >
                        ✅ Zatwierdź
                    </button>
                    <button
                        onClick={() => handleDecline(property.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                        ❌ Odrzuć
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
