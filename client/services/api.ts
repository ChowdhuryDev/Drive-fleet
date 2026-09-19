import axios from 'axios';

/**
 * DriveFleet Centralized API Service Configuration.
 * Adheres to Requirements 9, 10, 18, 22 & 23:
 * - Browser requests use NEXT_PUBLIC_API_URL or relative Next.js proxy rewrite to avoid hardcoding.
 * - Next.js server-side requests use INTERNAL_SERVER_URL for server-to-server communication.
 * - Automatically attaches Better Auth Bearer token and forwards session credentials.
 */
const isBrowser = typeof window !== 'undefined';

// In browser: use relative '' (proxied by Next.js rewrites to Express) or NEXT_PUBLIC_API_URL
// On server: use INTERNAL_SERVER_URL (defaults to http://localhost:5000)
const getBaseUrl = (): string => {
  if (isBrowser) {
    // If in browser and NEXT_PUBLIC_API_URL is explicitly set to an absolute URL on a different port,
    // in cloud environments relative '' routes via Next.js reverse proxy on port 3000 to internal port 5000
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  // Server-side (SSR / Server Actions / Server Components) uses INTERNAL_SERVER_URL
  return process.env.INTERNAL_SERVER_URL || 'http://localhost:5000';
};

export const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach Better Auth token to Authorization: Bearer <token>
api.interceptors.request.use(async (config) => {
  if (isBrowser) {
    try {
      const { authClient } = await import('@/lib/auth-client');
      const session = await authClient.getSession();
      const token = session?.data?.session?.token;
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Proceed with cookies if session check throws
    }
  }
  return config;
});

export interface Car {
  _id: string;
  id?: string;
  carName: string;
  dailyRentPrice: number;
  carType: string;
  imageURL: string;
  seatCapacity: number;
  pickupLocation: string;
  description: string;
  availabilityStatus: 'available' | 'unavailable';
  ownerEmail: string;
  ownerName: string;
  ownerPhoto?: string;
  bookingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  id?: string;
  userEmail: string;
  userName: string;
  carId: string;
  carName: string;
  carImage: string;
  dailyRentPrice: number;
  totalPrice: number;
  rentalDays: number;
  driverNeeded: boolean;
  specialNote?: string;
  bookingDate: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
}

export const carService = {
  async getCars(params?: {
    search?: string;
    type?: string;
    availability?: string;
    limit?: number;
    sort?: string;
  }): Promise<ApiResponse<Car[]>> {
    const response = await api.get<ApiResponse<Car[]>>('/cars', { params });
    return response.data;
  },

  async getCarById(id: string): Promise<ApiResponse<Car>> {
    const response = await api.get<ApiResponse<Car>>(`/cars/${id}`);
    return response.data;
  },

  async createCar(data: Partial<Car>): Promise<ApiResponse<Car>> {
    const response = await api.post<ApiResponse<Car>>('/cars', data);
    return response.data;
  },

  async updateCar(id: string, data: Partial<Car>): Promise<ApiResponse<Car>> {
    const response = await api.patch<ApiResponse<Car>>(`/cars/${id}`, data);
    return response.data;
  },

  async deleteCar(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/cars/${id}`);
    return response.data;
  },

  async getMyCars(): Promise<ApiResponse<Car[]>> {
    const response = await api.get<ApiResponse<Car[]>>('/my-cars');
    return response.data;
  },
};

export const bookingService = {
  async createBooking(data: {
    carId: string;
    rentalDays: number;
    driverNeeded: boolean;
    specialNote?: string;
  }): Promise<ApiResponse<Booking>> {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings/my');
    return response.data;
  },
};

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<ApiResponse<UserProfile>>('/users/me');
    return response.data;
  },

  async updateProfile(data: { name?: string; image?: string }): Promise<ApiResponse<UserProfile>> {
    const response = await api.patch<ApiResponse<UserProfile>>('/users/me', data);
    return response.data;
  },
};
