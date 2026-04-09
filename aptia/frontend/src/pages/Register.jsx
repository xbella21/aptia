import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', documentId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.data.user, data.data.token);
      navigate('/dashboard');
    } catch (err) {
        const msg = err.response?.data?.message;
        setError(msg === 'secretOrPrivateKey must have a value' ? 'Error de configuración del servidor. Contacta al administrador.' : msg || 'Error al registrarse');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>AP<span style={styles.logoAccent}>T</span>IA</div>
          <p style={styles.tagline}>Orientación vocacional inteligente</p>
        </div>
        <div style={styles.body}>
          <h2 style={styles.title}>Crear cuenta</h2>
          <p style={styles.sub}>Completa tus datos para comenzar</p>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={submit}>
            <label style={styles.label}>Nombre completo</label>
            <input style={styles.input} name="fullName" placeholder="Tu nombre completo" value={form.fullName} onChange={handle} required />
            <label style={styles.label}>Correo electrónico</label>
            <input style={styles.input} name="email" type="email" placeholder="tucorreo@email.com" value={form.email} onChange={handle} required />
            <label style={styles.label}>Número de documento</label>
            <input style={styles.input} name="documentId" placeholder="123456789" value={form.documentId} onChange={handle} required />
            <label style={styles.label}>Contraseña</label>
            <input style={styles.input} name="password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={handle} required />
            <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
          <p style={styles.linkText}>¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--beige)', padding: '20px' },
  card: { width: '100%', maxWidth: '400px', background: 'var(--white)', borderRadius: '16px', border: '0.5px solid var(--beige-border)', overflow: 'hidden' },
  header: { background: 'var(--green-dark)', padding: '28px 28px 22px' },
  logo: { fontSize: '26px', fontWeight: '700', color: '#e8f5e3', letterSpacing: '-0.5px' },
  logoAccent: { color: '#8fc87e' },
  tagline: { color: '#a8d49a', fontSize: '13px', marginTop: '4px' },
  body: { padding: '28px' },
  title: { fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' },
  sub: { fontSize: '13px', color: 'var(--text-mid)', marginBottom: '24px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', background: 'var(--beige)', border: '0.5px solid var(--beige-border)', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: 'var(--text-dark)', marginBottom: '16px', outline: 'none' },
  btn: { width: '100%', background: 'var(--green-dark)', color: '#e8f5e3', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  error: { background: '#fdf0f0', border: '0.5px solid #f5c6c6', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' },
  linkText: { textAlign: 'center', fontSize: '13px', color: 'var(--text-mid)', marginTop: '16px' },
  link: { color: 'var(--green-dark)', fontWeight: '600', textDecoration: 'none' },
};