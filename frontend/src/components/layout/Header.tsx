import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>Annuities Analysis</Link>
      <div style={styles.right}>
        {user?.company_name && <span style={styles.company}>{user.company_name}</span>}
        <span style={styles.email}>{user?.email}</span>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1e293b',
    color: 'white',
  },
  logo: { fontSize: '1.25rem', margin: 0, color: 'white', textDecoration: 'none' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  company: { fontSize: '0.9rem', color: '#cbd5e1', marginRight: '0.5rem' },
  email: { fontSize: '0.9rem', color: '#94a3b8' },
  logout: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid #64748b',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
