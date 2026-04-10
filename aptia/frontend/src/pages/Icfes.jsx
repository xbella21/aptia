import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Icfes() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ scoreMath: '', scoreReading: '', scoreSciences: '', scoreSocial: '', scoreEnglish: '', scoreGlobal: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/icfes', Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)])));
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar puntajes');
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    setConfirming(true);
    try {
      await api.post('/icfes/confirm');
      navigate('/ranking');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al confirmar');
      setConfirming(false);
    }
  };

  const fields = [
    { name: 'scoreMath', label: 'Matematicas' },
    { name: 'scoreReading', label: 'Lectura critica' },
    { name: 'scoreSciences', label: 'Ciencias naturales' },
    { name: 'scoreSocial', label: 'Ciencias sociales' },
    { name: 'scoreEnglish', label: 'Ingles' },
    { name: 'scoreGlobal', label: 'Puntaje global' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>Volver</button>
        <div style={styles.logo}>APTIA</div>
      </div>
      <div style={styles.container}>
        <h2 style={styles.title}>Puntaje ICFES</h2>
        <p style={styles.sub}>Ingresa tus puntajes por area</p>
        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.successBox}>
            <p style={styles.successMsg}>Puntajes guardados correctamente</p>
            <p style={styles.successSub}>Confirma tus puntajes para generar tu ranking</p>
            <button style={styles.confirmBtn} onClick={confirm} disabled={confirming}>
              {confirming ? 'Confirmando...' : 'Confirmar y ver ranking'}
            </button>
            <button style={styles.dashBtn} onClick={() => navigate('/dashboard')}>Volver al inicio</button>
          </div>
        )}
        {!success && (
          <form onSubmit={submit}>
            <div style={styles.grid}>
              {fields.map(f => (
                <div key={f.name}>
                  <label style={styles.label}>{f.label}</label>
                  <input style={styles.input} name={f.name} type="number" min="0" max="500" placeholder="0 - 500" value={form[f.name]} onChange={handle} required />
                </div>
              ))}
            </div>
            <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar puntajes'}
            </button>
          </form>
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
  container: { maxWidth: '480px', margin: '0 auto', padding: '28px 20px' },
  title: { fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' },
  sub: { fontSize: '13px', color: 'var(--text-mid)', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', background: 'var(--white)', border: '0.5px solid var(--beige-border)', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none' },
  btn: { width: '100%', background: 'var(--green-dark)', color: '#e8f5e3', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  successBox: { background: 'var(--green-pale)', border: '0.5px solid var(--green-light)', borderRadius: '12px', padding: '20px', textAlign: 'center' },
  successMsg: { fontSize: '15px', fontWeight: '600', color: 'var(--green-dark)', marginBottom: '6px' },
  successSub: { fontSize: '13px', color: 'var(--text-mid)', marginBottom: '16px' },
  confirmBtn: { width: '100%', background: 'var(--green-dark)', color: '#e8f5e3', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' },
  dashBtn: { width: '100%', background: 'transparent', color: 'var(--text-mid)', border: '0.5px solid var(--beige-border)', borderRadius: '8px', padding: '10px', fontSize: '13px', cursor: 'pointer' },
  error: { background: '#fdf0f0', border: '0.5px solid #f5c6c6', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' },
};
