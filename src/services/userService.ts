import axios from "axios";
import { User } from "../interfaces/users/User";

const API: string = import.meta.env.VITE_USERS_API;

// Register new user
export function registerUser(normalizedUser: User) {
  return axios.post(API, normalizedUser);
}

// Login exist user
export function loginUser(user: any) {
  return axios.post(`${API}/login`, user);
}

// get user by id
export function getUserById(id: string) {
  return axios.get(`${API}/${id}`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// update user - ensure complete objects
export function updateUser(id: string, updatedUser: any) {
  // Create a copy to avoid modifying the original object
  const userToSend = { ...updatedUser };
  
  // Remove fields that are not allowed to be updated
  if ('_id' in userToSend) {
    delete userToSend._id;
  }
  
  // Remove email as the server doesn't allow updating it
  if ('email' in userToSend) {
    delete userToSend.email;
  }
  
  // Remove isBusiness as it's not allowed to be updated this way
  if ('isBusiness' in userToSend) {
    delete userToSend.isBusiness;
  }
  
  // Log what we're sending to help with debugging
  console.log("Fields being sent to server:", userToSend);
  
  return axios.put(`${API}/${id}`, userToSend, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}