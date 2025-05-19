import { PropertyResponse } from "../types/PropertyResponse";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  property: PropertyResponse;
  currentImageIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onClick: () => void;
}

const PropertyCard = ({ property, currentImageIndex, onPrev, onNext, onClick }: Props) => {
  const currentImage =
    property.images[currentImageIndex] || "https://placehold.co/300x200?text=Brak+zdjęcia";

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={currentImage}
          alt={property.name}
          className="w-full h-48 object-cover"
        />

        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold flex items-center gap-2 shadow text-pink-600">
          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
          {property.averageRate?.toFixed(1) ?? "–"}/5 ·
          <span className="text-pink-500">{property.pricePerNight} zł</span>
        </div>

        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-pink-600 rounded-full p-1 shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-pink-600 rounded-full p-1 shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <div className="p-4 text-left">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{property.name}</h3>
        <p className="text-sm text-gray-500">
          {property.address.city}, {property.address.country}
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;
