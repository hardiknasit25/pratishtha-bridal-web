import api from "./api";

export interface Product {
  id?: string;
  DesignNo: string;
  TypeOfGarment: string;
  ColorOfGarment: string;
  BlouseColor: string;
  DupptaColor: string;
  Rate: number;
  FixCode: number;
}

export interface CreateProductRequest {
  DesignNo: string;
  TypeOfGarment: string;
  ColorOfGarment: string;
  BlouseColor: string;
  DupptaColor: string;
  Rate: number;
  FixCode: number;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

export const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get("/products");
    return response.data;
  },

  // Search products
  searchProducts: async (query: string, type?: string) => {
    const params = new URLSearchParams({ q: query });
    if (type) params.append("type", type);
    const response = await api.get(`/products/search?${params}`);
    return response.data;
  },

  // Get product by design number
  getProductByDesignNo: async (designNo: string) => {
    const response = await api.get(`/products/design/${designNo}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  createProduct: async (product: CreateProductRequest) => {
    const response = await api.post("/products", product);
    return response.data;
  },

  // Update product
  updateProduct: async (product: UpdateProductRequest) => {
    const response = await api.put(`/products/${product.id}`, product);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
