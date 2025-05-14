export type BookingResponse = {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  finalPrice: number;
  guests: GuestResponse[];
}

export type GuestResponse = {
    firstName: string;
    lastName: string;
}