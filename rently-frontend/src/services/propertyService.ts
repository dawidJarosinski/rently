import api from "./api";

export const fetchPropertyImages = async (propertyId: string): Promise<string[]> => {
  const res = await api.get<string[]>(`/properties/${propertyId}/images`);
  return res.data;
};
