import { useState } from 'react';

export interface ProductFilters {
  product_type?: string;
  carrier_rating?: string;
  state?: string;
  min_rate?: number;
  max_fee?: number;
  surrender_period?: number;
  min_investment?: number;
  page?: number;
  limit?: number;
}

interface FilterPanelProps {
  filters: ProductFilters;
  onApply: (f: ProductFilters) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onApply, onReset }: FilterPanelProps) {
  const [local, setLocal] = useState<ProductFilters>(filters);

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>Filters</h3>
      <div style={styles.grid}>
        <label style={styles.label}>
          Product Type
          <select
            value={local.product_type ?? ''}
            onChange={(e) => setLocal({ ...local, product_type: e.target.value || undefined })}
            style={styles.input}
          >
            <option value="">All</option>
            <option value="FIA">FIA</option>
            <option value="RILA">RILA</option>
            <option value="MYGA">MYGA</option>
            <option value="SPIA">SPIA</option>
            <option value="DIA">DIA</option>
          </select>
        </label>
        <label style={styles.label}>
          Carrier Rating
          <select
            value={local.carrier_rating ?? ''}
            onChange={(e) => setLocal({ ...local, carrier_rating: e.target.value || undefined })}
            style={styles.input}
          >
            <option value="">All</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
          </select>
        </label>
        <label style={styles.label}>
          State
          <input
            type="text"
            placeholder="e.g. CA"
            value={local.state ?? ''}
            onChange={(e) => setLocal({ ...local, state: e.target.value || undefined })}
            style={styles.input}
            maxLength={2}
          />
        </label>
        <label style={styles.label}>
          Min Base Rate (%)
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 1.5"
            value={local.min_rate ?? ''}
            onChange={(e) => setLocal({ ...local, min_rate: e.target.value ? Number(e.target.value) : undefined })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Max Annual Fee (%)
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 1.5"
            value={local.max_fee ?? ''}
            onChange={(e) => setLocal({ ...local, max_fee: e.target.value ? Number(e.target.value) : undefined })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Max Surrender (yr)
          <input
            type="number"
            placeholder="e.g. 10"
            value={local.surrender_period ?? ''}
            onChange={(e) => setLocal({ ...local, surrender_period: e.target.value ? Number(e.target.value) : undefined })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Min Investment ($)
          <input
            type="number"
            placeholder="e.g. 25000"
            value={local.min_investment ?? ''}
            onChange={(e) => setLocal({ ...local, min_investment: e.target.value ? Number(e.target.value) : undefined })}
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.actions}>
        <button onClick={() => onApply(local)} style={styles.btnApply}>Apply</button>
        <button onClick={onReset} style={styles.btnReset}>Reset</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  title: { margin: '0 0 1rem', fontSize: '1rem', color: '#334155' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: '#64748b' },
  input: { padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  btnApply: { padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnReset: { padding: '0.5rem 1rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' },
};
