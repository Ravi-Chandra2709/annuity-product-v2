import { useState } from 'react';
import api from '../services/api';

export default function IncomeCalculator() {
  const [age, setAge] = useState(65);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [state, setState] = useState('CA');
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [deferralYears, setDeferralYears] = useState(0);
  const [payoutType, setPayoutType] = useState<'single' | 'joint'>('single');
  const [result, setResult] = useState<{ results: unknown[]; total_results: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/calculator/income', {
        age,
        gender,
        state,
        investment_amount: investmentAmount,
        deferral_years: deferralYears,
        payout_type: payoutType,
      });
      setResult(data);
    } catch (err) {
      setError('Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.title}>Income Calculator</h2>
      <p style={styles.subtitle}>Calculate projected income from annuity products. (API stub — results will populate when full logic is implemented.)</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <label style={styles.label}>
            Age
            <input type="number" min={18} max={85} value={age} onChange={(e) => setAge(Number(e.target.value))} style={styles.input} />
          </label>
          <label style={styles.label}>
            Gender
            <select value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')} style={styles.input}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label style={styles.label}>
            State
            <input type="text" maxLength={2} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} style={styles.input} placeholder="CA" />
          </label>
        </div>
        <div style={styles.row}>
          <label style={styles.label}>
            Investment Amount ($)
            <input type="number" min={10000} value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} style={styles.input} />
          </label>
          <label style={styles.label}>
            Deferral Years
            <input type="number" min={0} max={20} value={deferralYears} onChange={(e) => setDeferralYears(Number(e.target.value))} style={styles.input} />
          </label>
          <label style={styles.label}>
            Payout Type
            <select value={payoutType} onChange={(e) => setPayoutType(e.target.value as 'single' | 'joint')} style={styles.input}>
              <option value="single">Single Life</option>
              <option value="joint">Joint Life</option>
            </select>
          </label>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {result && (
        <div style={styles.result}>
          <h3>Results</h3>
          {result.results?.length ? (
            <pre>{JSON.stringify(result.results, null, 2)}</pre>
          ) : (
            <p>Total results: {result.total_results}. Full calculation logic coming in Phase 2.</p>
          )}
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
  error: { color: '#dc2626', marginBottom: '0.5rem' },
  btn: { padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  result: { marginTop: '1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' },
};
