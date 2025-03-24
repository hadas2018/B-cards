import axios from "axios";
import { decodeToken } from "../services/tokenService";
import { Card } from "../interfaces/cards/Cards";
import { Address } from "../interfaces/cards/Address";
import { Image } from "../interfaces/cards/Image";

const API: string = import.meta.env.VITE_CARDS_API || "";

// Custom event name for card updates
export const CARDS_UPDATED_EVENT = "cardsUpdated";

// Cache management for cards
let allCardsCache: Card[] | null = null;
let lastAllCardsFetchTime: number = 0;
let favoriteCardsCache: Card[] | null = null;
let lastFavoriteFetchTime: number = 0;
const CACHE_DURATION = 2 * 60 * 1000; // Cache valid for 2 minutes

// Create an API service with common functionality
const apiService = {
  // Setup authentication interceptor
  setup() {
    axios.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers["x-auth-token"] = token;
      }
      return config;
    });
  },

  // Helper to process updates and handle common post-update tasks
  processUpdate(promise: Promise<any>) {
    return promise.then((response) => {
      clearAllCaches();
      dispatchCardsUpdated();
      return response;
    });
  },

  // Generic GET method
  get(endpoint: string) {
    return axios.get(`${API}${endpoint}`);
  },

  // Generic POST method with update handling
  post(endpoint: string, data: Omit<Card, "_id">) {
    return this.processUpdate(axios.post(`${API}${endpoint}`, data));
  },

  // Generic PUT method with update handling
  put(
    endpoint: string,
    data: {
      userId: (userId: any) => import("react").ReactNode;
      createdAt: string | number | Date;
      imageAlt: string | number | readonly string[] | undefined;
      imageUrl: string | number | readonly string[] | undefined;
      fallbackImage: string;
      title: string;
      subtitle: string;
      description: string;
      phone: string;
      email: string;
      web: string;
      image: Image;
      address: Address;
      bizNumber?: number | undefined;
      likes?: string[] | undefined;
      user_id?: string | undefined;
    }
  ) {
    return this.processUpdate(
      axios.put(`${API}${endpoint}`, data, {
        headers: {
          "x-auth-token": sessionStorage.getItem("token"),
        },
      })
    );
  },

  // Generic DELETE method with update handling
  delete(endpoint: string) {
    return this.processUpdate(axios.delete(`${API}${endpoint}`));
  },

  // Generic PATCH method with update handling
  patch(endpoint: string) {
    return this.processUpdate(axios.patch(`${API}${endpoint}`));
  },
};

// Initialize the API service
apiService.setup();

// Function to dispatch card update event
function dispatchCardsUpdated() {
  window.dispatchEvent(new CustomEvent(CARDS_UPDATED_EVENT));
}

// Function to clear all caches
export function clearAllCaches() {
  allCardsCache = null;
  lastAllCardsFetchTime = 0;
  favoriteCardsCache = null;
  lastFavoriteFetchTime = 0;
  console.log("All caches cleared");
}

// Get all cards with caching
export async function getAllCards(forceRefresh: boolean = false) {
  // Check if cache is valid
  const now = Date.now();
  const isCacheValid =
    allCardsCache !== null && now - lastAllCardsFetchTime < CACHE_DURATION;

  // If data exists in cache and cache is valid, return from cache
  if (isCacheValid && !forceRefresh) {
    console.log("Using cached all cards");
    return { data: allCardsCache };
  }

  try {
    // Fetch new data from server
    const response = await apiService.get("");

    // Save results in cache
    allCardsCache = response.data;
    lastAllCardsFetchTime = now;

    return response;
  } catch (error) {
    console.error("Error fetching all cards:", error);
    throw error;
  }
}

// Get card by ID
export function getCardById(id: string) {
  return apiService.get(`/${id}`);
}

// Get all cards of the logged-in user
export function getMyCards() {
  return apiService.get("/my-cards");
}

// Get all cards that the user has liked - with caching
export async function getFavoriteCards(forceRefresh: boolean = false) {
  // Check if cache is valid
  const now = Date.now();
  const isCacheValid =
    favoriteCardsCache !== null && now - lastFavoriteFetchTime < CACHE_DURATION;

  // If data exists in cache and cache is valid, return from cache
  if (isCacheValid && !forceRefresh) {
    console.log("Using cached favorite cards");
    return { data: favoriteCardsCache };
  }

  try {
    // Get all cards
    const allCardsResponse = await getAllCards(forceRefresh);
    const allCards = allCardsResponse.data;

    // Get current user ID from token
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("User not logged in");
    }

    const decodedToken = decodeToken(token);
    const userId = decodedToken._id;

    if (!userId) {
      throw new Error("Cannot identify user");
    }

    // Filter only cards that the user has liked
    const favoriteCards = allCards.filter(
      (card: { likes: string | any[] }) =>
        card.likes && Array.isArray(card.likes) && card.likes.includes(userId)
    );

    // Update cache
    favoriteCardsCache = favoriteCards;
    lastFavoriteFetchTime = now;

    return { data: favoriteCards };
  } catch (error) {
    console.error("Error loading favorite cards:", error);
    throw error;
  }
}

// Add new card
export function postNewCard(card: Omit<Card, "_id">) {
  return apiService.post("", card);
}

// Update existing card
export function updateCard(id: string, card: Omit<Card, "_id">) {
  // Create a copy of the card to not modify the original object
  const cardToUpdate = { ...card };

  // Remove fields that cannot be updated
  if ("_id" in cardToUpdate) {
    delete cardToUpdate._id;
  }

  if ("likes" in cardToUpdate) {
    delete cardToUpdate.likes;
  }

  if ("user_id" in cardToUpdate) {
    delete cardToUpdate.user_id;
  }

  if ("bizNumber" in cardToUpdate) {
    delete cardToUpdate.bizNumber;
  }

  console.log("Sending to server:", cardToUpdate);

  return apiService.put(`/${id}`, cardToUpdate);
}

// Delete card
export function deleteCard(id: string) {
  return apiService.delete(`/${id}`);
}

// Add or remove like from card
export function toggleCardLike(id: string) {
  return apiService.patch(`/${id}`);
}
