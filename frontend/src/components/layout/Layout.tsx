import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.body}>
        <Sidebar />
        <main style={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8fafc' },
  body: { display: 'flex', flex: 1, minHeight: 'calc(100vh - 60px)' },
  main: { flex: 1, padding: '2rem', maxWidth: '1400px', margin: 0, background: '#f8fafc', minHeight: '100%' },
};
