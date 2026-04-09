import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [icfes, setIcfes] = useState(null);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    api.get('/icfes/me')
      .then(({ data }) => setIcfes(data.data))
      .catch(() => {});
  }, []);

  const icfesPercent = icfes ? Math.min((icfes.scoreGlobal / 500) * 100, 100) : 0;

  const menu = [
    { label: 'Registrar puntaje ICFES', path: '/icfes', badge: null, icon: '📊' },
    { label: 'Prueba psicométrica', path: '/psychometric', badge: 'Nuevo', icon: '🧠' },
    { label: 'Ver ranking', path: '/ranking', badge: null, icon: '🏆' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <div style={styles.logo}>AP<span style={styles.logoAccent}>T</span>IA</div>
        <div style={styles.navRight}>
          <div style={styles.avatar}>{initials}</div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Salir</button>
        </div>
      </div>

      <div style={styles.hero}>
        <p style={styles.heroSub}>Bienvenido de nuevo</p>
        <h1 style={styles.heroTitle}>Hola, {user?.fullName?.split(' ')[0]} 👋</h1>
        <p style={styles.heroDesc}>Aquí está tu progreso en APTIA</p>
      </div>

      <div style={styles.container}>
        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.cardIcon}>📈</span>
              <span style={styles.cardLabel}>Puntaje ICFES</span>
            </div>
            <div style={styles.cardVal}>{icfes ? icfes.scoreGlobal : '—'}</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${icfesPercent}%` }} />
            </div>
            <p style={styles.cardHint}>{icfes ? `${Math.round(icfesPercent)}% del máximo` : 'Sin registrar'}</p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.cardIcon}>🎯</span>
              <span style={styles.cardLabel}>Perfil vocacional</span>
            </div>
            <div style={styles.cardVal}>—</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: '0%' }} />
            </div>
            <p style={styles.cardHint}>Sin completar</p>
          </div>
        </div>

        <p style={styles.sectionTitle}>Acciones</p>
        <div style={styles.menuSection}>
          {menu.map(item => (
            <div key={item.path} style={styles.menuItem} onClick={() => navigate(item.path)}>
              <span style={styles.menuIcon}>{item.icon}</span>
              <span style={styles.menuText}>{item.label}</span>
              {item.badge && <span style={styles.badge}>{item.badge}</span>}
              <span style={styles.menuArrow}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--beige)' },
  nav: { background: 'var(--green-dark)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '20px', fontWeight: '700', color: '#e8f5e3' },
  logoAccent: { color: '#8fc87e' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', background: '#8fc87e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: 'var(--green-dark)' },
  logoutBtn: { background: 'transparent', border: '0.5px solid #8fc87e', color: '#a8d49a', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' },
  hero: { background: 'var(--green-dark)', padding: '28px 24px 40px', marginBottom: '-20px' },
  heroSub: { fontSize: '12px', color: '#8fc87e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
  heroTitle: { fontSize: '26px', fontWeight: '700', color: '#e8f5e3', marginBottom: '4px' },
  heroDesc: { fontSize: '14px', color: '#a8d49a' },
  container: { maxWidth: '480px', margin: '0 auto', padding: '28px 20px' },
  cards: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' },
  card: { background: 'var(--white)', border: '0.5px solid var(--beige-border)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' },
  cardIcon: { fontSize: '16px' },
  cardLabel: { fontSize: '12px', color: 'var(--text-mid)', fontWeight: '500' },
  cardVal: { fontSize: '26px', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '10px' },
  progressBar: { height: '4px', background: 'var(--beige-mid)', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' },
  progressFill: { height: '100%', background: 'var(--green-dark)', borderRadius: '2px', transition: 'width 0.8s ease' },
  cardHint: { fontSize: '11px', color: 'var(--text-light)' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' },
  menuSection: { display: 'flex', flexDirection: 'column', gap: '10px' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--white)', border: '0.5px solid var(--beige-border)', borderRadius: '14px', cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' },
  menuIcon: { fontSize: '18px', width: '32px', height: '32px', background: 'var(--green-pale)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: '14px', color: 'var(--text-dark)', fontWeight: '500', flex: 1 },
  badge: { fontSize: '11px', background: 'var(--green-pale)', color: 'var(--green-dark)', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
  menuArrow: { fontSize: '20px', color: 'var(--text-light)' },
};