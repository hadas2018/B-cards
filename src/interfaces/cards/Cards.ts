import { Address } from "./Address";
import { Image } from "./Image";

export interface Card {
  fallbackImage: string;
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  image: Image;
  address: Address;
  bizNumber?: number;
  likes?: string[];
  user_id?: string;
}
