import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Psychometric() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/psychometric/questions')
      .then(({ data }) => setQuestions(data.data))
      .catch(() => setError('Error al cargar preguntas'))
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = (question, value) => {
    setAnswers({ ...answers, [question._id]: { area: question.area, value } });
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = Object.values(answers);
      await api.post('/psychometric/submit', { answers: payload });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar respuestas');
    } finally {
      setSubmitting(false);
    }
  };

  const labels = ['Nada', 'Poco', 'Algo', 'Bastante', 'Mucho'];
  const answered = Object.keys(answers).length;

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Volver</button>
        <div style={styles.logo}>AP<span style={styles.logoAccent}>T</span>IA</div>
        <span style={styles.progress}>{answered}/{questions.length}</span>
      </div>
      <div style={styles.container}>
        <h2 style={styles.title}>Prueba psicométrica</h2>
        <p style={styles.sub}>Responde con honestidad según tu interés en cada área</p>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>✓ Respuestas enviadas. Redirigiendo...</div>}
        {loading ? (
          <p style={{ color: 'var(--text-mid)', textAlign: 'center', padding: '40px 0' }}>Cargando preguntas...</p>
        ) : (
          <>
            {questions.map((q, i) => {
              const selected = answers[q._id]?.value;
              return (
                <div key={q._id} style={styles.questionCard}>
                  <p style={styles.questionNum}>Pregunta {i + 1}</p>
                  <p style={styles.questionText}>{q.statement}</p>
                  <div style={styles.options}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        key={val}
                        style={{
                          ...styles.optionBtn,
                          ...(selected === val ? styles.optionActive : {}),
                        }}
                        onClick={() => handleAnswer(q, val)}
                      >
                        <span style={{ ...styles.optionNum, ...(selected === val ? styles.optionNumActive : {}) }}>{val}</span>
                        <span style={styles.optionLabel}>{labels[val - 1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {questions.length > 0 && (
              <button
                style={{ ...styles.btn, opacity: (submitting || answered < questions.length) ? 0.6 : 1 }}
                onClick={submit}
                disabled={submitting || answered < questions.length}
              >
                {submitting ? 'Enviando...' : `Enviar respuestas (${answered}/${questions.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--beige)' },
  nav: { background: 'var(--green-dark)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' },
  back: { background: 'transparent', border: 'none', color: '#a8d49a', fontSize: '14px', cursor: 'pointer' },
  logo: { fontSize: '18px', fontWeight: '700', color: '#e8f5e3', flex: 1 },
  logoAccent: { color: '#8fc87e' },
  progress: { fontSize: '13px', color: '#a8d49a', fontWeight: '600' },
  container: { maxWidth: '560px', margin: '0 auto', padding: '28px 20px' },
  title: { fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' },
  sub: { fontSize: '13px', color: 'var(--text-mid)', marginBottom: '24px' },
  questionCard: { background: 'var(--white)', border: '0.5px solid var(--beige-border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  questionNum: { fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  questionText: { fontSize: '15px', color: 'var(--text-dark)', marginBottom: '16px', lineHeight: '1.5' },
  options: { display: 'flex', gap: '8px' },
  optionBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 4px', background: 'var(--beige)', border: '1.5px solid transparent', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s ease' },
  optionActive: { background: 'var(--green-pale)', border: '1.5px solid var(--green-light)', boxShadow: '0 2px 8px rgba(45,90,39,0.15)' },
  optionNum: { fontSize: '16px', fontWeight: '600', color: 'var(--text-mid)' },
  optionNumActive: { color: 'var(--green-dark)' },
  optionLabel: { fontSize: '10px', color: 'var(--text-mid)' },
  btn: { width: '100%', background: 'var(--green-dark)', color: '#e8f5e3', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  error: { background: '#fdf0f0', border: '0.5px solid #f5c6c6', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' },
  successMsg: { background: 'var(--green-pale)', border: '0.5px solid var(--green-light)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--green-dark)', marginBottom: '16px' },
};