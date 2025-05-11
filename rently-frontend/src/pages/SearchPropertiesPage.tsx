import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../component/PropertyCard";
import { PropertyWithImages } from "../types/PropertyResponse";
import Navbar from "../component/Navbar";
import SearchBar from "../component/SearchBar";

const SearchPropertiesPage = () => {
  const locationSearch = useLocation();
  const searchParams = new URLSearchParams(locationSearch.search);
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get<PropertyWithImages[]>('/properties/search', {
          params: {
            location: searchParams.get("destination") || undefined,
            checkIn: searchParams.get("checkIn") || undefined,
            checkOut: searchParams.get("checkOut") || undefined,
            guestCount: searchParams.get("guests") || undefined,
          },
        });

        const propsWithImages = await Promise.all(
          res.data.map(async (prop) => {
            try {
              const imageRes = await api.get<string[]>(`/properties/${prop.id}/images`);
              const thumbnails = imageRes.data.map(
                (fileId) => `https://drive.google.com/thumbnail?id=${fileId}`
              );
              return { ...prop, images: thumbnails };
            } catch {
              return { ...prop, images: [] };
            }
          })
        );

        setProperties(propsWithImages);

        const indexMap: Record<string, number> = {};
        propsWithImages.forEach((p) => (indexMap[p.id] = 0));
        setImageIndices(indexMap);
      } catch (err) {
        console.error("Błąd podczas wyszukiwania", err);
      }
    };

    fetchProperties();
  }, [locationSearch.search]);

  const handlePrev = (id: string) => {
    setImageIndices((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + properties.find((p) => p.id === id)!.images.length) % properties.find((p) => p.id === id)!.images.length,
    }));
  };

  const handleNext = (id: string) => {
    setImageIndices((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % properties.find((p) => p.id === id)!.images.length,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <SearchBar />

        <h1 className="text-2xl font-bold text-pink-600 my-6">Wyniki wyszukiwania</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              currentImageIndex={imageIndices[property.id] || 0}
              onPrev={() => handlePrev(property.id)}
              onNext={() => handleNext(property.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPropertiesPage;
