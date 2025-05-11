import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../component/Navbar";

interface Guest {
  firstName: string;
  lastName: string;
}

interface Booking {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  finalPrice: number;
  guests: Guest[];
}

const HostBookingsPage = () => {
  const { propertyId } = useParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>("/host/bookings", {
          params: propertyId ? { propertyId } : {},
        });
        setBookings(res.data);
      } catch (err) {
        setError("Nie udało się pobrać rezerwacji.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [propertyId]);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-pink-600">
            Rezerwacje dla nieruchomości {propertyId}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Powrót
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Wczytywanie...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">Brak rezerwacji.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white shadow-md border border-pink-300 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-pink-600">Rezerwacja</h2>
                <p className="text-sm text-gray-700">Od: {booking.checkIn} Do: {booking.checkOut}</p>
                <p className="text-sm text-gray-700">Cena: {booking.finalPrice} zł</p>
                <p className="text-sm text-gray-700">Goście:</p>
                <ul className="list-disc list-inside text-sm">
                  {booking.guests.map((g, i) => (
                    <li key={i}>{g.firstName} {g.lastName}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default HostBookingsPage;
