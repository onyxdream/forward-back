export interface User {
  id: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  created_at: number;
  premium: boolean;
  salt: string;
}
