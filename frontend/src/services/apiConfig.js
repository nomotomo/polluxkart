// API Configuration for PolluxKart
// Uses the backend URL from environment variables

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

export const API_CONFIG = {
  baseUrl: `${API_BASE_URL}/api`,
  endpoints: {
    // Auth
    auth: {
      register: '/auth/register',
      login: '/auth/login',
      me: '/auth/me',
    },
    // Products
    products: {
      list: '/products',
      single: (id) => `/products/${id}`,
      categories: '/products/categories',
      brands: '/products/brands',
      reviews: (id) => `/products/${id}/reviews`,
    },
    // Cart
    cart: {
      get: '/cart',
      addItem: '/cart/items',
      updateItem: (productId) => `/cart/items/${productId}`,
      removeItem: (productId) => `/cart/items/${productId}`,
      clear: '/cart',
    },
    // Wishlist
    wishlist: {
      get: '/wishlist',
      products: '/wishlist/products',
      addItem: '/wishlist/items',
      removeItem: (productId) => `/wishlist/items/${productId}`,
      check: (productId) => `/wishlist/check/${productId}`,
    },
    // Orders
    orders: {
      list: '/orders',
      create: '/orders',
      single: (id) => `/orders/${id}`,
      byNumber: (number) => `/orders/number/${number}`,
      cancel: (id) => `/orders/${id}/cancel`,
    },
    // Payments
    payments: {
      createOrder: '/payments/create-order',
      verify: '/payments/verify',
    },
    // Health
    health: '/health',
  },
};

// Auth token management
const TOKEN_KEY = 'polluxkart-token';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);

// Create headers with optional auth
export const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic fetch wrapper with error handling
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const { includeAuth = true, ...fetchOptions } = options;
  
  const config = {
    ...fetchOptions,
    headers: {
      ...getHeaders(includeAuth),
      ...fetchOptions.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle no content responses
    if (response.status === 204) {
      return null;
    }
    
    // Clone response to avoid "Body is disturbed or locked" error
    const responseClone = response.clone();
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, try to get text from cloned response
      const text = await responseClone.text();
      console.error('Failed to parse JSON response:', text);
      throw new Error('Invalid server response');
    }
    
    if (!response.ok) {
      const error = new Error(data.detail || data.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    console.error('API fetch error:', error);
    throw new Error(error.message || 'Network error');
  }
};

export default API_CONFIG;
