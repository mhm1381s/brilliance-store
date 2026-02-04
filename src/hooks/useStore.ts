import { useState, useEffect, useCallback } from 'react';
import { User, Product, CartItem, Order, UserRole } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import washingMachine from '@/assets/products/washing-machine.jpg';
import refrigerator from '@/assets/products/refrigerator.jpg';
import smartTv from '@/assets/products/smart-tv.jpg';
import headphones from '@/assets/products/headphones.jpg';
import coffeeMachine from '@/assets/products/coffee-machine.jpg';
import vacuum from '@/assets/products/vacuum.jpg';
import airConditioner from '@/assets/products/air-conditioner.jpg';
import microwave from '@/assets/products/microwave.jpg';

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'ماشین لباسشویی هوشمند',
    description: 'ماشین لباسشویی 9 کیلویی با تکنولوژی AI و کنترل از راه دور',
    price: 28500000,
    originalPrice: 32000000,
    discount: 11,
    category: 'لوازم شستشو',
    image: washingMachine,
    stock: 15,
    sellerId: 'seller1',
    sellerName: 'الکترو مارکت',
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    name: 'یخچال ساید بای ساید',
    description: 'یخچال فریزر با صفحه نمایش لمسی و قابلیت‌های هوشمند',
    price: 75000000,
    originalPrice: 85000000,
    discount: 12,
    category: 'یخچال و فریزر',
    image: refrigerator,
    stock: 8,
    sellerId: 'seller1',
    sellerName: 'الکترو مارکت',
    rating: 4.9,
    reviews: 567,
  },
  {
    id: '3',
    name: 'تلویزیون LED 55 اینچ',
    description: 'تلویزیون هوشمند با کیفیت 4K و سیستم عامل اندروید',
    price: 32000000,
    category: 'تلویزیون و صوتی',
    image: smartTv,
    stock: 20,
    sellerId: 'seller2',
    sellerName: 'دیجی هوم',
    rating: 4.7,
    reviews: 890,
  },
  {
    id: '4',
    name: 'هدفون بی‌سیم پریمیوم',
    description: 'هدفون بلوتوثی با قابلیت حذف نویز و باتری 30 ساعته',
    price: 4500000,
    originalPrice: 5500000,
    discount: 18,
    category: 'لوازم جانبی',
    image: headphones,
    stock: 50,
    sellerId: 'seller2',
    sellerName: 'دیجی هوم',
    rating: 4.6,
    reviews: 1234,
  },
  {
    id: '5',
    name: 'قهوه‌ساز اسپرسو',
    description: 'دستگاه قهوه‌ساز حرفه‌ای با فشار 19 بار',
    price: 8900000,
    category: 'لوازم آشپزخانه',
    image: coffeeMachine,
    stock: 25,
    sellerId: 'seller1',
    sellerName: 'الکترو مارکت',
    rating: 4.5,
    reviews: 456,
  },
  {
    id: '6',
    name: 'جاروبرقی شارژی',
    description: 'جاروبرقی بدون سیم با مکش قدرتمند و فیلتر HEPA',
    price: 12500000,
    category: 'لوازم نظافتی',
    image: vacuum,
    stock: 30,
    sellerId: 'seller2',
    sellerName: 'دیجی هوم',
    rating: 4.4,
    reviews: 789,
  },
  {
    id: '7',
    name: 'کولر گازی اینورتر',
    description: 'کولر گازی 24000 با تکنولوژی کم‌مصرف اینورتر',
    price: 42000000,
    originalPrice: 48000000,
    discount: 13,
    category: 'سرمایش و گرمایش',
    image: airConditioner,
    stock: 12,
    sellerId: 'seller1',
    sellerName: 'الکترو مارکت',
    rating: 4.8,
    reviews: 321,
  },
  {
    id: '8',
    name: 'مایکروویو دیجیتال',
    description: 'مایکروویو 25 لیتری با گریل و کانوکشن',
    price: 5800000,
    category: 'لوازم آشپزخانه',
    image: microwave,
    stock: 40,
    sellerId: 'seller2',
    sellerName: 'دیجی هوم',
    rating: 4.3,
    reviews: 654,
  },
];

const defaultUsers: User[] = [
  {
    id: 'admin1',
    name: 'مدیر سیستم',
    email: 'admin@electroshop.ir',
    role: 'admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'seller1',
    name: 'الکترو مارکت',
    email: 'seller@electroshop.ir',
    role: 'seller',
    createdAt: '2024-01-15',
  },
];

export function useStore() {
  const [user, setUser] = useLocalStorage<User | null>('electro-user', null);
  const [products, setProducts] = useLocalStorage<Product[]>('electro-products', defaultProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('electro-cart', []);
  const [isDark, setIsDark] = useLocalStorage<boolean>('electro-dark', false);
  const [orders, setOrders] = useLocalStorage<Order[]>('electro-orders', []);
  const [allUsers, setAllUsers] = useLocalStorage<User[]>('electro-users', defaultUsers);
  const [wishlist, setWishlist] = useLocalStorage<string[]>('electro-wishlist', []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const login = useCallback((email: string, password: string, role: UserRole, name: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    // Add to all users if new
    setAllUsers((prev) => {
      const exists = prev.find((u) => u.email === email);
      if (!exists) {
        return [...prev, newUser];
      }
      return prev;
    });
    return true;
  }, [setUser, setAllUsers]);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
  }, [setUser, setCart]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, [setCart]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, [setCart]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [setCart, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => {
    if (!user || user.role !== 'seller') return;
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}`,
      sellerId: user.id,
      sellerName: user.name,
    };
    setProducts((prev) => [...prev, newProduct]);
  }, [user, setProducts]);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  }, [setProducts]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, [setProducts]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => !prev);
  }, [setIsDark]);

  // Order management
  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [...prev, order]);
  }, [setOrders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, [setOrders]);

  // User management (admin only)
  const updateUserRole = useCallback((userId: string, role: UserRole) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  }, [setAllUsers]);

  const deleteUser = useCallback((userId: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
  }, [setAllUsers]);

  // Wishlist management
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, [setWishlist]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    user,
    products,
    cart,
    isDark,
    orders,
    allUsers,
    wishlist,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleDark,
    addOrder,
    updateOrderStatus,
    updateUserRole,
    deleteUser,
    toggleWishlist,
    cartTotal,
    cartCount,
  };
}
