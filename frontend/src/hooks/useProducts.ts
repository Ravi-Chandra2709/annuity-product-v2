import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { ProductListResponse } from '../types/product';

export interface ProductFilters {
  product_type?: string;
  carrier_rating?: string;
  state?: string;
  min_rate?: number;
  max_fee?: number;
  surrender_period?: number;
  min_investment?: number;
  max_investment?: number;
  page?: number;
  limit?: number;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async (): Promise<ProductListResponse> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
      const { data } = await api.get(`/api/products?${params.toString()}`);
      return data;
    },
  });
}
