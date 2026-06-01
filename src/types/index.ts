import { Timestamp } from "firebase/firestore";

export type UserRole = "superadmin" | "admin";

export interface UserRecord {
  uid: string;
  email: string;
  role: UserRole;
  expiresAt: Timestamp | null;
  createdAt: Timestamp;
  createdBy: string;
}

export type AdminExpiry = "1m" | "3m" | "6m" | "12m";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  images: string[];
  category: string;
  available: boolean;
  featured: boolean;
  createdAt: Timestamp;
  createdBy: string;
}
