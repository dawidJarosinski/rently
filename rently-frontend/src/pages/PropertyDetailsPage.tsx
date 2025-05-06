import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../component/Navbar";

interface Property {
  id: string;
  name: string;
  description: string;
  propertyType: string;
  pricePerNight: number;
  maxNumberOfGuests: number;
  address: {
    city: string;
    country: string;
  };
}

interface Guest {
  firstName: string;
  lastName: string;
}

interface BookingResponse {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  finalPrice: number;
  guests: Guest[];
}

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState<Guest>({ firstName: "", lastName: "" });
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProperty = async () => {
      const res = await api.get<Property>(`/properties/${id}`);
      setProperty(res.data);
    };

    const fetchImages = async () => {
      const res = await api.get<string[]>(`/properties/${id}/images`);
      setImages(res.data.map(fileId => `http://localhost:8080/api/properties/images/${fileId}`));
    };

    fetchProperty();
    fetchImages();
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut && property) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) {
        setFinalPrice(diff * property.pricePerNight);
      } else {
        setFinalPrice(null);
      }
    } else {
      setFinalPrice(null);
    }
  }, [checkIn, checkOut, property]);

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
    if (!checkIn || !checkOut || guests.length === 0 || !property) return;

    try {
      const payload = {
        checkIn,
        checkOut,
        guests
      };

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
        <div className="w-full md:w-[65%] max-w-5xl mx-auto">
          <div className="aspect-w-16 aspect-h-9 bg-cyan-100 rounded-2xl border-2 border-pink-400 shadow-md overflow-hidden">
            {images.length > 0 && (
              <img
                src={images[index]}
                alt="property"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="flex justify-center mt-2 space-x-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full cursor-pointer ${
                  i === index ? "bg-pink-500" : "bg-purple-400"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-pink-600">
              {property.name} in {property.address.city}
            </h2>
            <p className="text-sm text-purple-500 mt-1">{property.description}</p>
          </div>
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
