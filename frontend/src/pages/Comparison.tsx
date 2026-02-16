import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Comparison() {
  const [productIds, setProductIds] = useState<string[]>([]);
  const { data } = useQuery({
    queryKey: ['products-for-compare'],
    queryFn: () => api.get('/api/products?limit=50').then((r) => r.data),
  });

  const products = (data?.items ?? []) as { id: string; product_name: string; carrier_name: string }[];

  const toggleProduct = (id: string) => {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  return (
    <div>
      <h2 style={styles.title}>Product Comparison</h2>
      <p style={styles.subtitle}>Select up to 4 products to compare side by side. (Full comparison logic in Phase 2.)</p>

      <div style={styles.section}>
        <h3>Select Products</h3>
        <div style={styles.checklist}>
          {products.map((p) => (
            <label key={p.id} style={styles.checkItem}>
              <input
                type="checkbox"
                checked={productIds.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
                disabled={!productIds.includes(p.id) && productIds.length >= 4}
              />
              <span>{p.product_name} — {p.carrier_name}</span>
            </label>
          ))}
        </div>
      </div>

      {productIds.length > 0 && (
        <div style={styles.selected}>
          <h3>Selected ({productIds.length})</h3>
          <p>{productIds.join(', ')}</p>
          <p style={styles.note}>Side-by-side comparison view coming in Phase 2.</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: { marginBottom: '0.5rem', color: '#1e293b' },
  subtitle: { color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' },
  section: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' },
  checklist: { display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflow: 'auto' },
  checkItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' },
  selected: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' },
  note: { color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' },
};
