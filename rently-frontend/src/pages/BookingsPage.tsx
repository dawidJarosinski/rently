import { useEffect, useState } from "react";
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

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>("/bookings");
        setBookings(res.data);
      } catch (err: any) {
        setError("Nie udało się pobrać rezerwacji.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz anulować rezerwację?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert("Błąd podczas usuwania rezerwacji.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Twoje rezerwacje</h1>

        {loading ? (
          <p className="text-gray-600">Wczytywanie...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">Brak rezerwacji.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white shadow-md border border-pink-300 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-pink-600">Rezerwacja na nieruchomość ID: {booking.propertyId}</h2>
                    <p className="text-sm text-gray-700">od: {booking.checkIn} do: {booking.checkOut}</p>
                    <p className="text-sm text-gray-700">Cena: {booking.finalPrice} zł</p>
                    <p className="text-sm text-gray-700">Goście: {booking.guests.map(g => `${g.firstName} ${g.lastName}`).join(", ")}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="text-red-500 hover:text-red-700 text-sm border border-red-300 rounded px-3 py-1"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default BookingsPage;
