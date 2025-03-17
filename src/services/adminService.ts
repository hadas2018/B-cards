import axios from 'axios';
import { Card } from '../interfaces/cards/Cards';
import { User } from '../interfaces/users/User';
// import { User, Card } from '../interfaces/types';

// Constants
const API_BASE_URL = import.meta.env.VITE_USERS_API as string;
const CARDS_API_URL = API_BASE_URL.replace('/users', '/cards');

// Helper function to get the token
const getToken = () => {
  return sessionStorage.getItem('token');
};

// Helper function to create request headers
const getHeaders = () => {
  return {
    'x-auth-token': getToken()
  };
};

// Users API
export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: User): Promise<User> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${userId}`, userData, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, userData: User): Promise<User> => {
  return updateUser(userId, userData);
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${userId}`, {
      headers: getHeaders()
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Cards API
export const fetchAllCards = async (): Promise<Card[]> => {
  try {
    const response = await axios.get(CARDS_API_URL, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const updateCard = async (cardId: string, cardData: Card): Promise<Card> => {
  try {
    const response = await axios.put(`${CARDS_API_URL}/${cardId}`, cardData, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const deleteCard = async (cardId: string): Promise<void> => {
  try {
    await axios.delete(`${CARDS_API_URL}/${cardId}`, {
      headers: getHeaders()
    });
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};