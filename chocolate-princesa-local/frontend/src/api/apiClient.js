/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (API Client REST)
 * ====================================================================
 */

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api/v1`;
  }
  // En despliegue en Vercel se comunica directamente con la API Serverless en el mismo dominio
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api/v1';
  }
  return 'http://127.0.0.1:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Error en la petición';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = `Error HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // DASHBOARD KPIS
  getDashboardKPIs: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    return handleResponse(res);
  },

  // 1. CATEGORÍAS
  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(res);
  },
  createCategory: async (categoryData) => {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return handleResponse(res);
  },
  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // 2. PROVEEDORES
  getSuppliers: async () => {
    const res = await fetch(`${API_BASE_URL}/suppliers`);
    return handleResponse(res);
  },
  createSupplier: async (supplierData) => {
    const res = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierData)
    });
    return handleResponse(res);
  },
  deleteSupplier: async (id) => {
    const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // 3. PRODUCTOS
  getProducts: async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    return handleResponse(res);
  },
  createProduct: async (productData) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },
  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // 4. CLIENTES
  getClients: async () => {
    const res = await fetch(`${API_BASE_URL}/clients`);
    return handleResponse(res);
  },
  createClient: async (clientData) => {
    const res = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    return handleResponse(res);
  },
  deleteClient: async (id) => {
    const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // 5. PEDIDOS
  getOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return handleResponse(res);
  },
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },
  deleteOrder: async (id) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};
