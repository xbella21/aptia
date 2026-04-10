import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Ranking() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/ranking/generate')
      .then(({ data }) => setRanking(data.data))
      .catch(err => setError(err.response?.data?.message || 'Error al cargar el ranking'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Volver</button>
        <div style={styles.logo}>AP<span style={styles.logoAccent}>T</span>IA</div>
      </div>
      <div style={styles.container}>
        <h2 style={styles.title}>Ranking de programas</h2>
        <p style={styles.sub}>Programas ordenados por tu puntaje ponderado</p>
        {error && (
          <div style={styles.error}>
            {error === 'Debes confirmar tus puntajes ICFES primero'
              ? '⚠️ Debes confirmar tus puntajes ICFES antes de ver el ranking.'
              : error}
            {error.includes('confirmar') && (
              <span style={styles.errorLink} onClick={() => navigate('/icfes')}> Ir a ICFES →</span>
            )}
          </div>
        )}
        {loading ? (
          <p style={{ color: 'var(--text-mid)', textAlign: 'center', padding: '40px 0' }}>Cargando...</p>
        ) : (
          <div style={styles.list}>
            {ranking.map((item, i) => (
              <div key={i} style={styles.row}>
                <div style={styles.position}>#{i + 1}</div>
                <div style={styles.info}>
                  <p style={styles.name}>{item.programName}</p>
                  <span style={{ ...styles.badge, ...alignStyle(item.alignmentLevel) }}>
                    {alignLabel(item.alignmentLevel)}
                  </span>
                </div>
                <span style={styles.pts}>{item.weightedScore} pts</span>
              </div>
            ))}
            {ranking.length === 0 && !error && (
              <p style={{ color: 'var(--text-mid)', textAlign: 'center', padding: '40px 0' }}>Sin datos aún.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const alignLabel = a => ({ alta: '✓ Alta afinidad', parcial: '~ Afinidad parcial', sin_coincidencia: 'Sin coincidencia' }[a] || a);
const alignStyle = a => ({
  alta: { background: '#e8f5e3', color: '#2d5a27' },
  parcial: { background: '#fef9e7', color: '#856404' },
  sin_coincidencia: { background: '#f8f9fa', color: '#6b6455' },
}[a] || {});

const styles = {
  page: { minHeight: '100vh', background: 'var(--beige)' },
  nav: { background: 'var(--green-dark)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' },
  back: { background: 'transparent', border: 'none', color: '#a8d49a', fontSize: '14px', cursor: 'pointer' },
  logo: { fontSize: '18px', fontWeight: '700', color: '#e8f5e3' },
  logoAccent: { color: '#8fc87e' },
  container: { maxWidth: '480px', margin: '0 auto', padding: '28px 20px' },
  title: { fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' },
  sub: { fontSize: '13px', color: 'var(--text-mid)', marginBottom: '24px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'var(--white)', border: '0.5px solid var(--beige-border)', borderRadius: '12px' },
  position: { fontSize: '16px', fontWeight: '700', color: 'var(--green-dark)', minWidth: '32px' },
  info: { flex: 1 },
  name: { fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' },
  badge: { fontSize: '11px', padding: '2px 10px', borderRadius: '20px', fontWeight: '500' },
  pts: { fontSize: '14px', fontWeight: '700', color: 'var(--green-dark)' },
  error: { background: '#fdf0f0', border: '0.5px solid #f5c6c6', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' },
  errorLink: { color: 'var(--green-dark)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' },
};