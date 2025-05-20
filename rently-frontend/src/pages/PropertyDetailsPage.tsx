import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { PropertyResponse } from "../types/PropertyResponse";
import { BookingResponse, GuestResponse } from "../types/BookingResponse";
import { RatingResponse } from "../types/RatingResponse";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [newGuest, setNewGuest] = useState<GuestResponse>({ firstName: "", lastName: "" });
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [ratings, setRatings] = useState<RatingResponse[]>([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get<PropertyResponse>(`/properties/${id}`);
        const backendUrl = "http://localhost:8080";
        const prop = {
          ...res.data,
          images: res.data.images.map((path) =>
            path.startsWith("http") ? path : `${backendUrl}${path}`
          ),
        };
        setProperty(prop);
        setImages(prop.images);
      } catch (err) {
        console.error("Błąd podczas ładowania property:", err);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await api.get<RatingResponse[]>(`/properties/${id}/ratings`);
        setRatings(res.data);
      } catch (err) {
        console.error("Błąd podczas ładowania ocen:", err);
      }
    };

    if (id) fetchRatings();
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut && property) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setFinalPrice(diff > 0 ? diff * property.pricePerNight : null);
    } else {
      setFinalPrice(null);
    }
  }, [checkIn, checkOut, property]);

  useEffect(() => {
    const checkInFromQuery = searchParams.get("checkIn");
    const checkOutFromQuery = searchParams.get("checkOut");
    if (checkInFromQuery) setCheckIn(checkInFromQuery);
    if (checkOutFromQuery) setCheckOut(checkOutFromQuery);
  }, [searchParams]);

  const handleAddGuest = () => {
    if (!newGuest.firstName.trim() || !newGuest.lastName.trim()) return;
    if (guests.length >= (property?.maxNumberOfGuests ?? 0)) return;
    setGuests([...guests, newGuest]);
    setNewGuest({ firstName: "", lastName: "" });
    setShowGuestInput(false);
  };

  const handleRemoveGuest = (index: number) => {
    setGuests(prev => prev.filter((_, i) => i !== index));
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !property) return;

    try {
      const payload = { checkIn, checkOut, guests };
      const res = await api.post<BookingResponse>(`/properties/${property.id}/bookings`, payload);
      setBookingResponse(res.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Błąd podczas rezerwacji.");
    }
  };

  if (!property) return <div className="text-center text-pink-500 mt-10">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row gap-6 p-6 min-h-[400px] bg-white">
        <div className="w-full md:w-[65%] max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-3xl font-bold text-pink-600">{property.name}</h2>
              <p className="text-sm text-purple-500">{property.address.city}</p>
            </div>
            <div className="flex items-center text-yellow-500">
              <span className="text-xl font-semibold mr-1">
                {property.averageRate?.toFixed(1) ?? "–"}
              </span>
              <span className="text-sm">★</span>
            </div>
          </div>

          <div className="relative w-full aspect-[16/9] bg-cyan-100 rounded-2xl overflow-hidden border-2 border-pink-400 shadow-md">
            {images.length > 0 && (
              <img
                src={images[index]}
                alt="property"
                className="w-full h-full object-cover transition duration-300"
              />
            )}
            <button
              onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-pink-600 font-bold rounded-full p-2 shadow-md"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((prev) => (prev + 1) % images.length)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-pink-600 font-bold rounded-full p-2 shadow-md"
            >
              ›
            </button>
          </div>

          <div className="flex justify-center mt-2 space-x-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full border border-pink-500 ${
                  i === index ? "bg-pink-500" : "bg-purple-400"
                } cursor-pointer`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm text-center">
            <p className="text-sm text-purple-700">{property.description}</p>
          </div>

          {ratings.length > 0 && (
            <div className="mt-6 border-t border-pink-300 pt-4">
              <h3 className="text-xl font-semibold text-pink-600 mb-2">Oceny:</h3>
              <ul className="space-y-4">
                {ratings.map((rating) => (
                  <li
                    key={rating.id}
                    className="bg-white shadow-md rounded-xl p-4 border border-purple-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-pink-500 font-semibold">{rating.firstName}</span>
                      <span className="text-yellow-500 font-bold">{rating.rate}★</span>
                    </div>
                    <p className="text-sm text-purple-700 italic">"{rating.comment}"</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="w-full md:w-[30%] bg-gradient-to-br from-purple-400 to-pink-400 p-4 rounded-3xl shadow-md space-y-3 text-white self-start h-fit">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-xl p-2 text-black w-full"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-xl p-2 text-black w-full"
          />

          {guests.length > 0 && (
            <div className="bg-white text-pink-600 rounded-xl p-2 space-y-1">
              {guests.map((g, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span>{g.firstName} {g.lastName}</span>
                  <button
                    onClick={() => handleRemoveGuest(i)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    usuń
                  </button>
                </div>
              ))}
            </div>
          )}

          {showGuestInput && guests.length < property.maxNumberOfGuests && (
            <div className="bg-white rounded-xl p-3 text-black space-y-2">
              <input
                type="text"
                placeholder="Imię"
                value={newGuest.firstName}
                onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                className="w-full rounded px-2 py-1 border border-gray-300"
              />
              <input
                type="text"
                placeholder="Nazwisko"
                value={newGuest.lastName}
                onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                className="w-full rounded px-2 py-1 border border-gray-300"
              />
              <button
                onClick={handleAddGuest}
                className="bg-pink-500 text-white rounded-lg px-4 py-1 mt-2 w-full hover:bg-pink-600"
              >
                Dodaj gościa
              </button>
            </div>
          )}

          {!showGuestInput && guests.length < property.maxNumberOfGuests && (
            <button
              onClick={() => setShowGuestInput(true)}
              className="bg-white text-pink-600 font-semibold py-2 rounded-xl hover:bg-gray-100 transition"
            >
              ➕ Dodaj gościa
            </button>
          )}

          {finalPrice !== null && (
            <div className="bg-white text-pink-600 text-center p-2 rounded-xl">
              Cena końcowa: <strong>{finalPrice} zł</strong>
            </div>
          )}

          {error && <p className="text-sm text-red-200">{error}</p>}

          <button
            onClick={handleBooking}
            className="bg-white text-pink-600 font-semibold py-2 rounded-xl hover:bg-gray-100 transition disabled:opacity-50 w-full"
            disabled={!checkIn || !checkOut || guests.length === 0}
          >
            Rent
          </button>

          <p className="text-sm text-white text-center">
            Limit gości: {property.maxNumberOfGuests}
          </p>
        </div>
      </div>

      {bookingResponse && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-pink-600 shadow-lg rounded-xl px-6 py-4 border border-pink-300 z-50 max-w-lg w-full">
          <h3 className="text-lg font-bold mb-2">Rezerwacja potwierdzona!</h3>
          <p><strong>Od:</strong> {bookingResponse.checkIn}</p>
          <p><strong>Do:</strong> {bookingResponse.checkOut}</p>
          <p><strong>Goście:</strong></p>
          <ul className="list-disc list-inside text-sm">
            {bookingResponse.guests.map((g, i) => (
              <li key={i}>{g.firstName} {g.lastName}</li>
            ))}
          </ul>
          <p className="mt-2"><strong>Cena końcowa:</strong> {bookingResponse.finalPrice} zł</p>
        </div>
      )}
    </>
  );
};

export default PropertyDetailsPage;
