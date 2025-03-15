import { jwtDecode } from "jwt-decode";

export function decodeToken(token: any) {
  const decodedToken = jwtDecode(token as string);
  return decodedToken;
}
