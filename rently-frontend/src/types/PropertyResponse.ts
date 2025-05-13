export interface PropertyResponse {
    id: string;
    ownerId: string;
    propertyType: string;
    name: string;
    description: string;
    maxNumberOfGuests: number;
    pricePerNight: number;
    approved: boolean;
    averageRate: number;
    address: {
      country: string;
      city: string;
      street: string;
      houseNumber: string;
      apartmentNumber: string;
      postalCode: string;
    };
}

export interface PropertyWithImages extends PropertyResponse {
    images: string[];
  }