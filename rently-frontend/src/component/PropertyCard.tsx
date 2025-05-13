import { PropertyResponse } from "../types/PropertyResponse";
import { Star } from "lucide-react";

interface Props {
  property: PropertyResponse;
  currentImageIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onClick: () => void;
}

const PropertyCard = ({ property, currentImageIndex, onPrev, onNext, onClick }: Props) => {
  const currentImage = property.images[currentImageIndex] || "https://placehold.co/300x200?text=Brak+zdjęcia";

  return (
    <div
      className="bg-cyan-100 rounded-lg p-4 text-center shadow border border-pink-400 cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={currentImage}
          alt={property.name}
          className="w-full h-40 object-cover rounded-md"
        />

        <div className="absolute top-0 left-0 m-2 flex items-center bg-white bg-opacity-80 px-2 py-1 rounded-full text-sm font-semibold text-pink-600 shadow">
          <Star className="w-4 h-4 mr-1 fill-yellow-400 stroke-yellow-400" />
          {property.averageRate?.toFixed(1) ?? "–"}/5
        </div>

        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1"
            >
              ◀
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1"
            >
              ▶
            </button>
          </>
        )}

        <div className="absolute top-0 right-0 m-2 text-sm font-semibold text-pink-500">
          {property.pricePerNight}$
        </div>
      </div>

      <div className="mt-2 font-medium text-pink-600">
        {property.address.city}, {property.address.country}
      </div>
    </div>
  );
};

export default PropertyCard;
