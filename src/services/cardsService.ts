import axios from "axios";
// import { Card } from "../interfaces/cards/Card";
import { decodeToken } from "../services/tokenService";
import { Card } from "../interfaces/cards/Cards";

const API: string = import.meta.env.VITE_CARDS_API || "";

// שם האירוע המותאם אישית לעדכון כרטיסים
export const CARDS_UPDATED_EVENT = 'cardsUpdated';

// ניהול מטמון עבור כרטיסים
let allCardsCache: Card[] | null = null;
let lastAllCardsFetchTime: number = 0;
let favoriteCardsCache: Card[] | null = null;
let lastFavoriteFetchTime: number = 0;
const CACHE_DURATION = 2 * 60 * 1000; // מטמון תקף למשך 2 דקות

// פונקציה להוספת כותרת אימות לכל בקשה
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

// פונקציה להפצת אירוע עדכון כרטיסים
function dispatchCardsUpdated() {
  window.dispatchEvent(new CustomEvent(CARDS_UPDATED_EVENT));
}

// פונקציה לניקוי כל המטמונים
export function clearAllCaches() {
  allCardsCache = null;
  lastAllCardsFetchTime = 0;
  favoriteCardsCache = null;
  lastFavoriteFetchTime = 0;
  console.log("All caches cleared");
}

// קבל את כל הכרטיסים עם מטמון
export async function getAllCards(forceRefresh: boolean = false) {
  // בדוק האם המטמון תקף
  const now = Date.now();
  const isCacheValid = allCardsCache !== null && 
                      (now - lastAllCardsFetchTime) < CACHE_DURATION;
  
  // אם יש נתונים במטמון והמטמון תקף, החזר את הנתונים מהמטמון
  if (isCacheValid && !forceRefresh) {
    console.log("Using cached all cards");
    return { data: allCardsCache };
  }

  try {
    // הבא נתונים חדשים מהשרת
    const response = await axios.get<Card[]>(`${API}`);
    
    // שמור במטמון את התוצאות
    allCardsCache = response.data;
    lastAllCardsFetchTime = now;
    
    return response;
  } catch (error) {
    console.error("Error fetching all cards:", error);
    throw error;
  }
}

// קבל כרטיס לפי מזהה
export function getCardById(id: string) {
  return axios.get<Card>(`${API}/${id}`);
}

// קבל את כל הכרטיסים של המשתמש המחובר
export function getMyCards() {
  return axios.get<Card[]>(`${API}/my-cards`);
}

// הבא את כל הכרטיסים שהמשתמש סימן בלייק - עם מנגנון מטמון
export async function getFavoriteCards(forceRefresh: boolean = false) {
  // בדוק האם המטמון תקף
  const now = Date.now();
  const isCacheValid = favoriteCardsCache !== null && 
   (now - lastFavoriteFetchTime) < CACHE_DURATION;
  
  // אם יש נתונים במטמון והמטמון תקף, החזר את הנתונים מהמטמון
  if (isCacheValid && !forceRefresh) {
    console.log("Using cached favorite cards");
    return { data: favoriteCardsCache };
  }

  try {
    // קבל את כל הכרטיסים
    const allCardsResponse = await getAllCards(forceRefresh);
    const allCards = allCardsResponse.data;

    // קבל את מזהה המשתמש הנוכחי מהטוקן
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("משתמש לא מחובר");
    }

    const decodedToken = decodeToken(token);
    const userId = decodedToken._id;

    if (!userId) {
      throw new Error("לא ניתן לזהות את המשתמש");
    }

    // סנן רק את הכרטיסים שהמשתמש סימן בלייק
    const favoriteCards = allCards.filter(card => 
      card.likes && Array.isArray(card.likes) && card.likes.includes(userId)
    );

    // עדכן את המטמון
    favoriteCardsCache = favoriteCards;
    lastFavoriteFetchTime = now;

    return { data: favoriteCards };
  } catch (error) {
    console.error("שגיאה בטעינת כרטיסים מועדפים:", error);
    throw error;
  }
}

// הוסף כרטיס חדש
export function postNewCard(card: Omit<Card, "_id">) {
  return axios.post<Card>(`${API}`, card)
    .then(response => {
      clearAllCaches(); // נקה את כל המטמונים
      dispatchCardsUpdated(); // הפץ אירוע עדכון
      return response;
    });
}

// עדכן כרטיס קיים
export function updateCard(id: string, card: Omit<Card, "_id">) {
  return axios.put<Card>(`${API}/${id}`, card)
    .then(response => {
      clearAllCaches(); // נקה את כל המטמונים
      dispatchCardsUpdated(); // הפץ אירוע עדכון
      return response;
    });
}

// מחק כרטיס
export function deleteCard(id: string) {
  return axios.delete(`${API}/${id}`)
    .then(response => {
      clearAllCaches(); // נקה את כל המטמונים
      dispatchCardsUpdated(); // הפץ אירוע עדכון
      return response;
    });
}

// הוסף או הסר לייק לכרטיס
export function toggleCardLike(id: string) {
  return axios.patch<Card>(`${API}/${id}`)
    .then(response => {
      clearAllCaches(); // נקה את כל המטמונים
      dispatchCardsUpdated(); // הפץ אירוע עדכון
      return response;
    });
}
