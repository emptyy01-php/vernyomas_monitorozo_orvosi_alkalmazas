export interface User {
  id: string;
  firstname: string;
  lastname: string;
  role: 'user' | 'doctor';  
  email: string;
}