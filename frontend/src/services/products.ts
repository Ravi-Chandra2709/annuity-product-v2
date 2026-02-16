import api from './api';
import type { Product, IncomeRider, IndexOption, HistoricalPerformance } from '../types/product';

export const productsApi = {
  getProduct: (id: string) => api.get<Product>(`/api/products/${id}`),
  getRiders: (id: string) => api.get<IncomeRider[]>(`/api/products/${id}/riders`),
  getIndexOptions: (id: string) => api.get<IndexOption[]>(`/api/products/${id}/index-options`),
  getHistoricalPerformance: (id: string) =>
    api.get<HistoricalPerformance[]>(`/api/products/${id}/historical-performance`),
};
