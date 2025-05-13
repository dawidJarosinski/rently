import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../component/PropertyCard";
import { PropertyResponse } from "../types/PropertyResponse";
import Navbar from "../component/Navbar";
import SearchBar from "../component/SearchBar";

const SearchPropertiesPage = () => {
  const locationSearch = useLocation();
  const searchParams = new URLSearchParams(locationSearch.search);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const navigate = useNavigate();

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const res = await api.get<PropertyResponse[]>('/properties/search', {
        params: {
          location: searchParams.get("destination") || undefined,
          checkIn: searchParams.get("checkIn") || undefined,
          checkOut: searchParams.get("checkOut") || undefined,
          guestCount: searchParams.get("guests") || undefined,
        },
      });

      const backendUrl = "http://localhost:8080";

      const propsWithFullImages = res.data.map((prop) => ({
        ...prop,
        images: prop.images.map((path) =>
          path.startsWith("http") ? path : `${backendUrl}${path}`
        ),
      }));

      setProperties(propsWithFullImages);

      const indexMap: Record<string, number> = {};
      propsWithFullImages.forEach((p) => (indexMap[p.id] = 0));
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

  const handleNavigate = (id: string) => {
    const query = new URLSearchParams();
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
  
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);
  
    navigate(`/properties/${id}?${query.toString()}`);
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
              onClick={() => handleNavigate(property.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPropertiesPage;
