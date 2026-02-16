import { useState } from 'react';
import api from '../services/api';

export default function GrowthCalculator() {
  const [age, setAge] = useState(55);
  const [state, setState] = useState('TX');
  const [investmentAmount, setInvestmentAmount] = useState(250000);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [result, setResult] = useState<{ results: unknown[]; total_results: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/calculator/growth', {
        age,
        state,
        investment_amount: investmentAmount,
        time_horizon: timeHorizon,
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.title}>Growth Calculator</h2>
      <p style={styles.subtitle}>Project account value growth over time. (API stub — full logic in Phase 2.)</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <label style={styles.label}>
            Age <input type="number" min={18} max={85} value={age} onChange={(e) => setAge(Number(e.target.value))} style={styles.input} />
          </label>
          <label style={styles.label}>
            State <input type="text" maxLength={2} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} style={styles.input} placeholder="TX" />
          </label>
          <label style={styles.label}>
            Investment ($) <input type="number" min={10000} value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} style={styles.input} />
          </label>
          <label style={styles.label}>
            Time Horizon (yr) <input type="number" min={1} max={30} value={timeHorizon} onChange={(e) => setTimeHorizon(Number(e.target.value))} style={styles.input} />
          </label>
        </div>
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {result && (
        <div style={styles.result}>
          <h3>Results</h3>
          <p>Total results: {result.total_results}. Full projection logic coming in Phase 2.</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: { marginBottom: '0.5rem', color: '#1e293b' },
  subtitle: { color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' },
  form: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', maxWidth: '600px' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem', minWidth: '120px' },
  input: { padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' },
  btn: { padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  result: { marginTop: '1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' },
};
