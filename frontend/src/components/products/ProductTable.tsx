import type { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onRowClick?: (id: string) => void;
}

export default function ProductTable({ products, isLoading, onRowClick }: ProductTableProps) {
  if (isLoading) return <div style={styles.loading}>Loading products...</div>;
  if (!products?.length) return <div style={styles.empty}>No products found.</div>;

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Carrier</th>
            <th style={styles.th}>Rating</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Base Rate</th>
            <th style={styles.th}>Surrender</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} onClick={() => onRowClick?.(p.id)} style={onRowClick ? styles.rowClick : undefined}>
              <td style={styles.td}>{p.product_name || '-'}</td>
              <td style={styles.td}>{p.carrier_name || '-'}</td>
              <td>
                <span style={styles.badge}>{p.carrier_rating || '-'}</span>
              </td>
              <td style={styles.td}>{p.product_type || '-'}</td>
              <td style={styles.td}>{p.base_rate != null ? `${p.base_rate}%` : '-'}</td>
              <td style={styles.td}>{p.surrender_period ?? '-'} yr</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' },
  td: { padding: '0.75rem', borderBottom: '1px solid #e2e8f0' },
  badge: { background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' },
  rowClick: { cursor: 'pointer' },
  loading: { padding: '2rem', textAlign: 'center', color: '#64748b' },
  empty: { padding: '2rem', textAlign: 'center', color: '#64748b' },
};
