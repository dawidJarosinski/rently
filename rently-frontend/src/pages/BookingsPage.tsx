import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { BookingResponse } from "../types/BookingResponse";
import ReactModal from "react-modal";
import { Calendar, Users, Trash2, Star, Home } from "lucide-react";

type RatingRequest = {
  rate: number;
  comment: string;
};

ReactModal.setAppElement("#root");

const BookingsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [rating, setRating] = useState<RatingRequest>({ rate: 1, comment: "" });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<BookingResponse[]>("/bookings");
        setBookings(res.data);
      } catch {
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
    } catch {
      alert("Błąd podczas usuwania rezerwacji.");
    }
  };

  const handleRate = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!selectedPropertyId) return;
    try {
      await api.post(`/properties/${selectedPropertyId}/ratings`, rating);
      setShowRatingModal(false);
      setRating({ rate: 1, comment: "" });
      alert("Dziękujemy za ocenę!");
    } catch (err: any) {
      alert("Błąd podczas przesyłania oceny: " + err.response?.data || "");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6" /> Twoje rezerwacje
        </h1>

        {loading ? (
          <p className="text-gray-600">Wczytywanie...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Brak rezerwacji.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-pink-300 shadow-sm p-5 rounded-xl">
                <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-pink-600 flex items-center gap-1">
                      <Home className="w-5 h-5" /> ID: {booking.propertyId}
                    </h2>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      od {booking.checkIn} do {booking.checkOut}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      {booking.guests.map(g => `${g.firstName} ${g.lastName}`).join(", ")}
                    </p>
                    <p className="text-sm text-gray-700">
                      Cena: <span className="font-medium text-green-600">{booking.finalPrice} zł</span>
                    </p>
                  </div>

                  {new Date(booking.checkOut) > new Date() ? (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 border border-red-300 px-3 py-1.5 rounded-full shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Anuluj
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRate(booking.propertyId)}
                      className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-800 border border-pink-300 px-3 py-1.5 rounded-full shadow-sm"
                    >
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" /> Oceń
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      <ReactModal
        isOpen={showRatingModal}
        onRequestClose={() => setShowRatingModal(false)}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-auto mt-20 outline-none shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-lg font-bold mb-4 text-pink-600">Oceń nieruchomość</h2>

        <label className="block mb-1 text-sm font-medium">Ocena (1-5):</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating.rate}
          onChange={(e) => setRating({ ...rating, rate: parseInt(e.target.value) })}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 text-sm font-medium">Komentarz:</label>
        <textarea
          value={rating.comment}
          onChange={(e) => setRating({ ...rating, comment: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowRatingModal(false)}
            className="px-4 py-2 border border-gray-400 rounded text-gray-600 hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            onClick={submitRating}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Wyślij
          </button>
        </div>
      </ReactModal>
    </>
  );
};

export default BookingsPage;
