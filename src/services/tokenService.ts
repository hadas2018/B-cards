// import { jwtDecode } from "jwt-decode";

// export function decodeToken(token: any) {
//   const decodedToken = jwtDecode(token as string);
//   return decodedToken;
// }


import { jwtDecode } from "jwt-decode";

// הגדרת הממשק של הטוקן המפוענח
interface DecodedToken {
  _id: string;
  email?: string;
  name?: string;
  // הוסף שדות נוספים שיש בטוקן שלך
  iat?: number;
  exp?: number;
}

export function decodeToken(token: string): DecodedToken {
  const decodedToken = jwtDecode<DecodedToken>(token);
  return decodedToken;
}
