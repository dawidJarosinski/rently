import { useNavigate } from "react-router-dom";
import { PropertyWithImages } from "../types/PropertyResponse";

interface Props {
  property: PropertyWithImages;
  currentImageIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const PropertyCard = ({ property, currentImageIndex, onPrev, onNext }: Props) => {
  const navigate = useNavigate();
  const currentImage = property.images[currentImageIndex] || "https://placehold.co/300x200?text=Brak+zdjęcia";

  return (
    <div
      className="bg-cyan-100 rounded-lg p-4 text-center shadow border border-pink-400 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <div className="relative">
        <img
          src={currentImage}
          alt={property.name}
          className="w-full h-40 object-cover rounded-md"
        />
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
