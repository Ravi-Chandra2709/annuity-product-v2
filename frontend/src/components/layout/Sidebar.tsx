import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Products' },
  { to: '/income', label: 'Income Calculator' },
  { to: '/growth', label: 'Growth Calculator' },
  { to: '/comparison', label: 'Comparison' },
  { to: '/clients', label: 'Clients' },
];

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '220px',
    background: '#1e293b',
    color: 'white',
    minHeight: 'calc(100vh - 60px)',
    padding: '1rem 0',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  link: {
    display: 'block',
    padding: '0.75rem 1.5rem',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  linkActive: {
    background: '#334155',
    color: 'white',
    borderLeft: '3px solid #2563eb',
  },
};
