// Admin Service - API integration for admin operations
import { API_CONFIG, apiFetch } from './apiConfig';
import CloudinaryService from './cloudinaryService';

const ADMIN_BASE = '/admin';

// Dashboard
export const getDashboardStats = async () => {
  return await apiFetch(`${ADMIN_BASE}/dashboard`, { method: 'GET' });
};

// Image Upload - Uses Cloudinary if configured, falls back to local
export const uploadImage = async (file, onProgress = null) => {
  try {
    // Try Cloudinary first
    const isCloudinaryReady = await CloudinaryService.isCloudinaryConfigured();
    if (isCloudinaryReady) {
      const result = await CloudinaryService.uploadImage(file, 'products', onProgress);
      return { url: result.url, filename: result.publicId, size: result.size, content_type: `image/${result.format}` };
    }
  } catch (error) {
    console.warn('Cloudinary upload failed, falling back to local:', error);
  }
  
  // Fall back to local upload
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_CONFIG.baseUrl}${ADMIN_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('polluxkart-token')}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }
  
  const result = await response.json();
  // Prepend base URL to local uploads
  if (result.url && result.url.startsWith('/api/')) {
    result.url = `${API_CONFIG.baseUrl}${result.url}`;
  }
  return result;
};

export const uploadMultipleImages = async (files, onProgress = null) => {
  try {
    // Try Cloudinary first
    const isCloudinaryReady = await CloudinaryService.isCloudinaryConfigured();
    if (isCloudinaryReady) {
      const results = await CloudinaryService.uploadMultipleImages(files, 'products', onProgress);
      return results.map(r => ({ url: r.url, filename: r.publicId, size: r.size, content_type: `image/${r.format}` }));
    }
  } catch (error) {
    console.warn('Cloudinary upload failed, falling back to local:', error);
  }
  
  // Fall back to local upload
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const response = await fetch(`${API_CONFIG.baseUrl}${ADMIN_BASE}/upload/multiple`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('polluxkart-token')}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }
  
  const results = await response.json();
  // Prepend base URL to local uploads
  return results.map(result => {
    if (result.url && result.url.startsWith('/api/')) {
      result.url = `${API_CONFIG.baseUrl}${result.url}`;
    }
    return result;
  });
};

// Products
export const createProduct = async (productData) => {
  return await apiFetch(`${ADMIN_BASE}/products`, {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (productId, updateData) => {
  return await apiFetch(`${ADMIN_BASE}/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deleteProduct = async (productId) => {
  return await apiFetch(`${ADMIN_BASE}/products/${productId}`, {
    method: 'DELETE',
  });
};

// Categories
export const getAdminCategories = async () => {
  return await apiFetch(`${ADMIN_BASE}/categories`, { method: 'GET' });
};

export const createCategory = async (categoryData) => {
  return await apiFetch(`${ADMIN_BASE}/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = async (categoryId, updateData) => {
  return await apiFetch(`${ADMIN_BASE}/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deleteCategory = async (categoryId) => {
  return await apiFetch(`${ADMIN_BASE}/categories/${categoryId}`, {
    method: 'DELETE',
  });
};

// Promotions
export const getPromotions = async (status = null) => {
  const params = status ? `?status=${status}` : '';
  return await apiFetch(`${ADMIN_BASE}/promotions${params}`, { method: 'GET' });
};

export const createPromotion = async (promoData) => {
  return await apiFetch(`${ADMIN_BASE}/promotions`, {
    method: 'POST',
    body: JSON.stringify(promoData),
  });
};

export const updatePromotion = async (promoId, updateData) => {
  return await apiFetch(`${ADMIN_BASE}/promotions/${promoId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deletePromotion = async (promoId) => {
  return await apiFetch(`${ADMIN_BASE}/promotions/${promoId}`, {
    method: 'DELETE',
  });
};

export const validatePromotion = async (code, orderTotal) => {
  return await apiFetch(`${ADMIN_BASE}/promotions/validate?code=${code}&order_total=${orderTotal}`, {
    method: 'POST',
  });
};

// Orders (Admin)
export const getAdminOrders = async (page = 1, pageSize = 20, status = null, search = null) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  
  return await apiFetch(`${ADMIN_BASE}/orders?${params.toString()}`, { method: 'GET' });
};

export const updateOrderStatus = async (orderId, status, trackingNumber = null) => {
  const params = new URLSearchParams();
  params.append('status', status);
  if (trackingNumber) params.append('tracking_number', trackingNumber);
  
  return await apiFetch(`${ADMIN_BASE}/orders/${orderId}/status?${params.toString()}`, {
    method: 'PUT',
  });
};

// Users (Admin)
export const getAdminUsers = async (page = 1, pageSize = 20, search = null) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  if (search) params.append('search', search);
  
  return await apiFetch(`${ADMIN_BASE}/users?${params.toString()}`, { method: 'GET' });
};

export const updateUserRole = async (userId, role) => {
  return await apiFetch(`${ADMIN_BASE}/users/${userId}/role?role=${role}`, {
    method: 'PUT',
  });
};

const AdminService = {
  getDashboardStats,
  uploadImage,
  uploadMultipleImages,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotion,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
  updateUserRole,
};

export default AdminService;
