import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (
    page: number = 1,
    limit: number = 20,
    category?: string,
    tag?: string,
    minMrr?: number,
    maxMrr?: number
  ) => {
    const params: Record<string, any> = {
      skip: (page - 1) * limit,
      limit,
    }
    
    if (category) params.category = category
    if (tag) params.tag = tag
    if (minMrr !== undefined) params.min_mrr = minMrr
    if (maxMrr !== undefined) params.max_mrr = maxMrr
    
    const response = await api.get('/products/', { params })
    return response.data
  },

  // Get a specific product by ID
  getProduct: async (id: number) => {
    const response = await api.get(`/products/${id}`)
    return response.data.product
  },

  // Search products
  searchProducts: async (query: string, page: number = 1, limit: number = 20) => {
    const params = {
      q: query,
      skip: (page - 1) * limit,
      limit,
    }
    
    const response = await api.get('/products/search/', { params })
    return response.data
  },

  // Get MRR estimates for a product
  getProductEstimates: async (id: number) => {
    const response = await api.get(`/products/${id}/estimates`)
    return response.data
  },
}

export default api