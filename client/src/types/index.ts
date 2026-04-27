export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface SharedBy {
  id: number;
  name: string;
  email: string;
}

export interface Video {
  id: number;
  title: string;
  description: string | null;
  link: string;
  created_at: string;
  shared_by: SharedBy;
}

export interface AuthResponse {
  user: User;
  token: string;
}
