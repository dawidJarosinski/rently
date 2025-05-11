import { useEffect, useState } from "react";
import api from "../services/api";
import { PropertyResponse } from "../types/PropertyResponse";
import PropertyCard from "../component/PropertyCard";
import { useNavigate } from "react-router-dom";

interface PropertyWithImages extends PropertyResponse {
  images: string[];
}

const TopRatedFeed = () => {
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertiesWithImages = async () => {
      try {
        const res = await api.get<PropertyResponse[]>("/properties/feed?limit=5");
        const props = res.data;

        const propsWithImages = await Promise.all(
          props.map(async (prop) => {
            try {
              const imageRes = await api.get<string[]>(`/properties/${prop.id}/images`);
              const thumbnails = imageRes.data.map(fileId => `https://drive.google.com/thumbnail?id=${fileId}`);
              return { ...prop, images: thumbnails };
            } catch {
              return { ...prop, images: [] };
            }
          })
        );

        setProperties(propsWithImages);

        const indexMap: Record<string, number> = {};
        propsWithImages.forEach(p => {
          indexMap[p.id] = 0;
        });
        setImageIndices(indexMap);
      } catch (err) {
        console.error("Failed to load properties or images", err);
      }
    };

    fetchPropertiesWithImages();
  }, []);

  const handlePrev = (propertyId: string) => {
    setImageIndices(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] - 1 + properties.find(p => p.id === propertyId)?.images.length!) % properties.find(p => p.id === propertyId)?.images.length!
    }));
  };

  const handleNext = (propertyId: string) => {
    setImageIndices(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % properties.find(p => p.id === propertyId)?.images.length!
    }));
  };

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          currentImageIndex={imageIndices[property.id] || 0}
          onPrev={() => handlePrev(property.id)}
          onNext={() => handleNext(property.id)}
          onClick={() => navigate(`/properties/${property.id}`)}
        />
      ))}
      </div>
    </div>
  );
};

export default TopRatedFeed;
