import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Ranking() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/ranking')
      .then(({ data }) => setRanking(data.data))
      .catch(() => setError('Error al cargar el ranking'))
      .finally(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Volver</button>
        <div style={styles.logo}>AP<span style={styles.logoAccent}>T</span>IA</div>
      </div>
      <div style={styles.container}>
        <h2 style={styles.title}>Ranking general</h2>
        <p style={styles.sub}>Posiciones según puntaje ICFES</p>
        {error && <div style={styles.error}>{error}</div>}
        {loading ? (
          <p style={{ color: 'var(--text-mid)', textAlign: 'center', padding: '40px 0' }}>Cargando ranking...</p>
        ) : (
          <div style={styles.list}>
            {ranking.map((item, i) => (
              <div key={item._id} style={{ ...styles.row, ...(i < 3 ? styles.rowTop : {}) }}>
                <span style={styles.position}>{i < 3 ? medals[i] : `#${i + 1}`}</span>
                <div style={styles.info}>
                  <p style={styles.name}>{item.fullName}</p>
                  <p style={styles.score}>Puntaje global: {item.scoreGlobal}</p>
                </div>
                <span style={styles.pts}>{item.scoreGlobal} pts</span>
              </div>
            ))}
            {ranking.length === 0 && !error && (
              <p style={{ color: 'var(--text-mid)', textAlign: 'center', padding: '40px 0' }}>Aún no hay datos en el ranking.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
  row: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'var(--white)', border: '0.5px solid var(--beige-border)', borderRadius: '12px' },
  rowTop: { border: '0.5px solid var(--green-light)', background: 'var(--green-pale)' },
  position: { fontSize: '20px', minWidth: '32px', textAlign: 'center' },
  info: { flex: 1 },
  name: { fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)' },
  score: { fontSize: '12px', color: 'var(--text-mid)', marginTop: '2px' },
  pts: { fontSize: '14px', fontWeight: '600', color: 'var(--green-dark)' },
  error: { background: '#fdf0f0', border: '0.5px solid #f5c6c6', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' },
};