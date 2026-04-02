/**
 * API Service to fetch data from our Express backend
 */

export const apiService = {
  // Saare products lane ke liye
  async getProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Ek single product lane ke liye
  async getProductById(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  // Orders lane ke liye (Admin only)
  async getOrders() {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Unauthorized or error');
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  // Admin: Naya product add karne ke liye
  async createProduct(productData: any) {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Admin: Product update karne ke liye
  async updateProduct(id: string, productData: any) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Admin: Product delete karne ke liye
  async deleteProduct(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return await response.json();
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Admin: Order status update karne ke liye
  async updateOrderStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return await response.json();
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  }
};
