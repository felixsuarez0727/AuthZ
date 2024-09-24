// controllers/userController.ts
import { User, getUsers } from '../models/User';
import express, { Request, Response, NextFunction } from 'express';

export const findOrCreateUser = (email: string, role: 'customer' | 'admin'): User | null => {
  const existingUser = findUserByEmail(email);
  
  if (existingUser) {
    return null;  // Returns null if the user already exists
  }

  const newUser = { id: String(getUsers().length + 1), email, role };
  getUsers().push(newUser);
  return newUser;
};

export const findUserByEmail = (email: string): User | undefined => {
  return getUsers().find(u => u.email === email);
};

export const addUser = (email: string, role: 'customer' | 'admin'): User => {
  const newUser = { id: String(getUsers().length + 1), email, role };
  getUsers().push(newUser);
  return newUser;
};

export const initializeTestUsers = () => {
  if (getUsers().length === 0) {
    addUser("usuario1@example.com", "customer");
    addUser("usuario2@example.com", "admin");
    console.log("Usuarios de prueba inicializados");
  }
};

