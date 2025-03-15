export interface unnormalizedUser {
  first: string;
  middle?: string;
  last: string;
  phone: string;
  email: string;
  password: string;
  image?: string;
  alt?: string;
  state?: string;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip: number;
  isBusiness: boolean;
}
