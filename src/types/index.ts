export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  nationalId?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviews: number;
  specifications?: { key: string; value: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  address: Address;
  paymentMethod: 'card' | 'cash';
}

export interface Address {
  id: string;
  title: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  recipientName: string;
  recipientPhone: string;
}

export interface Wishlist {
  userId: string;
  productIds: string[];
}
