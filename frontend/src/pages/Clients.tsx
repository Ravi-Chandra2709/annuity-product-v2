import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Clients() {
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/api/clients').then((r) => r.data),
  });

  const clients = (data?.items ?? []) as { id: string; client_name: string; age: number; state: string; investment_amount: number }[];

  return (
    <div>
      <h2 style={styles.title}>Clients</h2>
      <p style={styles.subtitle}>Manage client profiles and saved scenarios. (Add/edit clients in Phase 3.)</p>

      {isLoading ? (
        <div style={styles.empty}>Loading...</div>
      ) : clients.length === 0 ? (
        <div style={styles.empty}>
          <p>No clients yet.</p>
          <p style={styles.note}>Create client profiles in Phase 3. Use the API: POST /api/clients</p>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>State</th>
                <th>Investment</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.client_name}</td>
                  <td>{c.age}</td>
                  <td>{c.state}</td>
                  <td>${c.investment_amount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: { marginBottom: '0.5rem', color: '#1e293b' },
  subtitle: { color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' },
  empty: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: '#64748b' },
  note: { fontSize: '0.85rem', marginTop: '0.5rem' },
  tableWrap: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
};
