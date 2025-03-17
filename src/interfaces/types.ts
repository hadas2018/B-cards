// src/interfaces/types.ts

import { User } from "./users/User";

// export interface User {
//     _id: string;
//     name: {
//       first: string;
//       middle?: string;
//       last: string;
//     };
//     email: string;
//     phone?: string;
//     image?: {
//       url?: string;
//       alt?: string;
//     };
//     address?: {
//       state?: string;
//       country?: string;
//       city?: string;
//       street?: string;
//       houseNumber?: string;
//       zip?: string;
//     };
//     isBusiness: boolean;
//     isAdmin: boolean;
//     createdAt?: string;
//   }
  
//   export interface Card {
//     _id: string;
//     title: string;
//     description: string;
//     imageUrl: string;
//     imageAlt: string;
//     bizNumber?: number;
//     phone: string;
//     address: {
//       street: string;
//       city: string;
//       country: string;
//       houseNumber: string;
//       zip: string;
//     };
//     userId: string;
//     createdAt: string;
//   }
  
  export interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => void;
  }