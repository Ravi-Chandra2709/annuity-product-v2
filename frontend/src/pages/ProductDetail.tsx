import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/products';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id!).then((r) => r.data),
    enabled: !!id,
  });

  const { data: riders } = useQuery({
    queryKey: ['product-riders', id],
    queryFn: () => productsApi.getRiders(id!).then((r) => r.data),
    enabled: !!id,
  });

  const { data: indexOptions } = useQuery({
    queryKey: ['product-index', id],
    queryFn: () => productsApi.getIndexOptions(id!).then((r) => r.data),
    enabled: !!id,
  });

  const { data: perf } = useQuery({
    queryKey: ['product-perf', id],
    queryFn: () => productsApi.getHistoricalPerformance(id!).then((r) => r.data),
    enabled: !!id,
  });

  if (!id) return <div>Invalid product</div>;
  if (isLoading || !product) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      <div style={styles.header}>
        <h2 style={styles.title}>{product.product_name}</h2>
        <span style={styles.badge}>{product.carrier_rating}</span>
      </div>
      <p style={styles.carrier}>{product.carrier_name} • {product.product_type}</p>

      <section style={styles.section}>
        <h3>Product Details</h3>
        <div style={styles.grid}>
          <div style={styles.card}><span>Base Rate</span><strong>{product.base_rate ?? '-'}%</strong></div>
          <div style={styles.card}><span>Cap Rate</span><strong>{product.cap_rate ?? '-'}%</strong></div>
          <div style={styles.card}><span>Annual Fee</span><strong>{product.annual_fee ?? '-'}%</strong></div>
          <div style={styles.card}><span>Surrender Period</span><strong>{product.surrender_period ?? '-'} yr</strong></div>
          <div style={styles.card}><span>Min Investment</span><strong>${(product.minimum_investment ?? 0).toLocaleString()}</strong></div>
          <div style={styles.card}><span>Max Investment</span><strong>${(product.maximum_investment ?? 0).toLocaleString()}</strong></div>
          <div style={styles.card}><span>Issue Ages</span><strong>{product.issue_ages_min ?? 0}–{product.issue_ages_max ?? '-'}</strong></div>
          <div style={styles.card}><span>Has Bonus</span><strong>{product.has_bonus ? `${product.bonus_percentage ?? 0}%` : 'No'}</strong></div>
        </div>
        {product.state_availability?.length ? (
          <p style={styles.states}>States: {product.state_availability.join(', ')}</p>
        ) : null}
      </section>

      {riders?.length ? (
        <section style={styles.section}>
          <h3>Income Riders</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Rider</th>
                <th>Fee</th>
                <th>Deferral Bonus</th>
                <th>Payout 65</th>
                <th>Payout 70</th>
                <th>Payout 75</th>
                <th>Lifetime</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((r) => (
                <tr key={r.id}>
                  <td>{r.rider_name}</td>
                  <td>{r.rider_fee ?? '-'}%</td>
                  <td>{r.deferral_bonus_rate ?? '-'}%</td>
                  <td>{r.payout_percentage_single_age_65 ?? '-'}%</td>
                  <td>{r.payout_percentage_single_age_70 ?? '-'}%</td>
                  <td>{r.payout_percentage_single_age_75 ?? '-'}%</td>
                  <td>{r.lifetime_guarantee ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {indexOptions?.length ? (
        <section style={styles.section}>
          <h3>Index Options</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Index</th>
                <th>Type</th>
                <th>Cap</th>
                <th>Participation</th>
                <th>Floor</th>
              </tr>
            </thead>
            <tbody>
              {indexOptions.map((o) => (
                <tr key={o.id}>
                  <td>{o.index_name}</td>
                  <td>{o.index_type}</td>
                  <td>{o.cap_rate ?? '-'}%</td>
                  <td>{o.participation_rate ?? '-'}%</td>
                  <td>{o.floor_rate ?? 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {perf?.length ? (
        <section style={styles.section}>
          <h3>Historical Performance</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Credited Rate</th>
                <th>Index Return</th>
                <th>Effective Return</th>
              </tr>
            </thead>
            <tbody>
              {perf.map((p) => (
                <tr key={p.id}>
                  <td>{p.year}</td>
                  <td>{p.credited_rate ?? '-'}%</td>
                  <td>{p.index_return ?? '-'}%</td>
                  <td>{p.effective_return ?? '-'}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backBtn: { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' },
  title: { margin: 0, fontSize: '1.5rem', color: '#1e293b' },
  badge: { background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem' },
  carrier: { color: '#64748b', marginBottom: '1.5rem' },
  section: { marginBottom: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' },
  card: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  states: { marginTop: '0.5rem', color: '#64748b', fontSize: '0.9rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' },
};
