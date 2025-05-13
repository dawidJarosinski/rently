import { useEffect, useState } from "react";
import api from "../services/api";
import { PropertyResponse } from "../types/PropertyResponse";
import PropertyCard from "../component/PropertyCard";
import { useNavigate } from "react-router-dom";

const TopRatedFeed = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const navigate = useNavigate();

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const res = await api.get<PropertyResponse[]>("/properties/feed?limit=5");
      const props = res.data;

      const backendUrl = "http://localhost:8080";

      const propsWithFullImageUrls = props.map((prop) => ({
        ...prop,
        images: prop.images.map((path) =>
          path.startsWith("http") ? path : `${backendUrl}${path}`
        ),
      }));

      setProperties(propsWithFullImageUrls);

      const indexMap: Record<string, number> = {};
      propsWithFullImageUrls.forEach(p => {
        indexMap[p.id] = 0;
      });
      setImageIndices(indexMap);
    } catch (err) {
      console.error("Failed to load properties", err);
    }
  };

  fetchProperties();
}, []);

  const handlePrev = (propertyId: string) => {
    setImageIndices(prev => {
      const property = properties.find(p => p.id === propertyId);
      if (!property || property.images.length === 0) return prev;
      const length = property.images.length;
      return {
        ...prev,
        [propertyId]: (prev[propertyId] - 1 + length) % length
      };
    });
  };

  const handleNext = (propertyId: string) => {
    setImageIndices(prev => {
      const property = properties.find(p => p.id === propertyId);
      if (!property || property.images.length === 0) return prev;
      const length = property.images.length;
      return {
        ...prev,
        [propertyId]: (prev[propertyId] + 1) % length
      };
    });
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
