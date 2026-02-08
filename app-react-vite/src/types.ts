export interface User {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
}

export interface Todo {
  id?: string;
  title: string;
  completed?: boolean;
}
