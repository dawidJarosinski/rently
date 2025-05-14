export type PropertyResponse  = {
  id: string;
  ownerId: string;
  propertyType: string;
  name: string;
  description: string;
  maxNumberOfGuests: number;
  pricePerNight: number;
  approved: boolean;
  averageRate: number;
  images: string[];
  address: {
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    apartmentNumber: string;
    postalCode: string;
  };
}
