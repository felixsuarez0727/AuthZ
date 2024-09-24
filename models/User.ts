// models/User.ts
export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

let users: User[] = [];

// Export only the list of users
export const getUsers = () => users;
