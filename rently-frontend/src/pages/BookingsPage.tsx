import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { BookingResponse } from "../types/BookingResponse";
import ReactModal from "react-modal";
import { AxiosError } from "axios";

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
    } catch (err: unknown | any) {
      alert("Błąd podczas przesyłania oceny: " + err.response.data);
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
                    <h2 className="text-lg font-semibold text-pink-600">
                      Rezerwacja na nieruchomość ID: {booking.propertyId}
                    </h2>
                    <p className="text-sm text-gray-700">od: {booking.checkIn} do: {booking.checkOut}</p>
                    <p className="text-sm text-gray-700">Cena: {booking.finalPrice} zł</p>
                    <p className="text-sm text-gray-700">Goście: {booking.guests.map(g => `${g.firstName} ${g.lastName}`).join(", ")}</p>
                  </div>
                  {new Date(booking.checkOut) > new Date() ? (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-500 hover:text-red-700 text-sm border border-red-300 rounded px-3 py-1"
                    >
                      Usuń
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRate(booking.propertyId)}
                      className="text-pink-600 hover:text-pink-800 text-sm border border-pink-300 rounded px-3 py-1"
                    >
                      Oceń
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <ReactModal
        isOpen={showRatingModal}
        onRequestClose={() => setShowRatingModal(false)}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-auto mt-20 outline-none shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-lg font-bold mb-4 text-pink-600">Oceń nieruchomość</h2>

        <label className="block mb-2 text-sm font-medium">Ocena (1-5):</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating.rate}
          onChange={(e) => setRating({ ...rating, rate: parseInt(e.target.value) })}
          className="w-full border border-gray-300 rounded px-3 py-1 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Wiadomość:</label>
        <textarea
          value={rating.comment}
          onChange={(e) => setRating({ ...rating, comment: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowRatingModal(false)}
            className="px-4 py-2 border border-gray-400 rounded text-gray-600"
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
