import { Address } from "./Address";
import { Image } from "./Image";

export interface Card {
  userId(userId: any): import("react").ReactNode;
  createdAt: string | number | Date;
  imageAlt: string | number | readonly string[] | undefined;
  imageUrl: string | number | readonly string[] | undefined;
  fallbackImage: string;
  _id: string;
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
