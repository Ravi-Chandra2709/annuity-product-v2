import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductTable from '../components/products/ProductTable';
import FilterPanel, { type ProductFilters } from '../components/calculators/FilterPanel';

export default function Dashboard() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 50 });
  const { data, isLoading } = useProducts(filters);
  const navigate = useNavigate();

  const handleApply = (f: ProductFilters) => setFilters({ ...f, page: 1, limit: 50 });
  const handleReset = () => setFilters({ page: 1, limit: 50 });

  return (
    <div>
      <h2 style={styles.title}>Products</h2>
      <FilterPanel filters={filters} onApply={handleApply} onReset={handleReset} />
      <ProductTable
        products={data?.items ?? []}
        isLoading={isLoading}
        onRowClick={(id) => navigate(`/product/${id}`)}
      />
      {data && (
        <p style={styles.meta}>
          Showing {data.items.length} of {data.total} products
        </p>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: { marginBottom: '1rem', color: '#1e293b' },
  meta: { marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' },
};
