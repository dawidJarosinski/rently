import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { BookingResponse } from "../types/BookingResponse";
import {
  Calendar,
  Users,
  ArrowLeft,
  BadgeDollarSign,
} from "lucide-react";

const HostBookingsPage = () => {
  const { propertyId } = useParams();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<BookingResponse[]>("/host/bookings", {
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

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-pink-600 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Rezerwacje {propertyId ? `dla nieruchomości ${propertyId}` : ""}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Powrót
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Wczytywanie...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Brak rezerwacji.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-pink-300 shadow-sm p-5 rounded-xl space-y-2"
              >
                <div className="flex items-center gap-2 text-pink-600 font-semibold text-lg">
                  <Calendar className="w-5 h-5" />
                  {booking.checkIn} → {booking.checkOut}
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <BadgeDollarSign className="w-4 h-4 text-green-500" />
                  Cena końcowa: {booking.finalPrice} zł
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-purple-500" />
                  Goście:
                </div>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-6">
                  {booking.guests.map((g, i) => (
                    <li key={i}>{g.firstName} {g.lastName}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </>
  );
};

export default HostBookingsPage;
