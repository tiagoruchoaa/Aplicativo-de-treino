import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const treinoSemanas = [
  { semana: 'S1', series: 14, carga: 95, status: 'normal' },
  { semana: 'S2', series: 15, carga: 95, status: 'normal' },
  { semana: 'S3', series: 15, carga: 110, status: 'normal' },
  { semana: 'S4', series: 11, carga: 110, status: 'pre' },
  { semana: 'S5', series: 10, carga: 100, status: 'deload' },
  { semana: 'S6', series: 0, carga: 0, status: 'normal' },
  { semana: 'S7', series: 14, carga: 110, status: 'normal' }
];

const modulos = [
  { nome: 'Perna A', exercicio: 'Leg Press 110 kg · 4 ex/sem (máx)', ganho: '+15,8%', cor: '#0a4a83' },
  { nome: 'Perna B', exercicio: 'Abdutora 52,6 kg · 5 ex/sem (máx)', ganho: '+35%', cor: '#c26d43' },
  { nome: 'Braços', exercicio: 'Bíceps Halter 9 kg · 6 ex/sem (máx)', ganho: '+50%', cor: '#0f7aaa' },
  { nome: 'Costas', exercicio: 'Remada Sup. 14 kg · 5 ex/sem (máx)', ganho: '+40%', cor: '#7a4ab0' },
  { nome: 'Peito', exercicio: 'Supino Reto 16 kg · 5 ex/sem (máx)', ganho: '+100%', cor: '#4d7e5e' }
];

function App() {
  const [tela, setTela] = useState('inicio');
  const [aba, setAba] = useState('pernaA');
  const [tipo, setTipo] = useState('aluno');
  const [mensagem, setMensagem] = useState('');
  const [logs, setLogs] = useState([
    { origem: 'aluno', texto: 'Finalizei o treino de Perna A com 14 séries.', horario: '08:05' },
    { origem: 'personal', texto: 'Ótimo! Amanhã reduza a carga em 5% no aquecimento.', horario: '08:14' }
  ]);

  const resumo = useMemo(() => {
    const validos = treinoSemanas.filter((w) => w.carga > 0);
    const primeira = validos[0]?.carga || 0;
    const ultima = validos[validos.length - 1]?.carga || 0;
    const ganho = primeira ? (((ultima - primeira) / primeira) * 100).toFixed(1).replace('.', ',') : '0';
    return { totalSeries: treinoSemanas.reduce((s, w) => s + w.series, 0), ganho };
  }, []);

  function enviarAtualizacao(event) {
    event.preventDefault();
    if (!mensagem.trim()) return;

    const novo = {
      origem: tipo,
      texto: mensagem.trim(),
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const respostaAutomatica =
      tipo === 'aluno'
        ? { origem: 'personal', texto: 'Recebi sua atualização. Vou ajustar a próxima sessão automaticamente.', horario: novo.horario }
        : { origem: 'aluno', texto: 'Perfeito, coach! Vou seguir as orientações no próximo treino.', horario: novo.horario };

    setLogs((prev) => [...prev, novo, respostaAutomatica]);
    setMensagem('');
  }

  return (
    <main className="app-bg">
      <section className="phone-frame">
        <header className="header">
          <p className="eyebrow">DIÁRIO DE TREINO</p>
          <h1>Marisa</h1>
          <p className="subtitle">Segunda-feira, 30 mar 2026</p>
        </header>

        {tela === 'inicio' ? (
          <div className="cards">
            <button className="card card-light" onClick={() => setTela('treino')}>
              <span>💪</span>
              <div>
                <h3>Iniciar Treino</h3>
                <p>Registrar séries, cargas e reps</p>
              </div>
            </button>
            <button className="card card-dark" onClick={() => setTela('relatorio')}>
              <span>📊</span>
              <div>
                <h3>Ver Relatório</h3>
                <p>Histórico, progressão e comparações</p>
              </div>
            </button>
            <button className="card card-dark" onClick={() => setTela('sync')}>
              <span>🔁</span>
              <div>
                <h3>Feed Aluno ↔ Personal</h3>
                <p>Atualizações automáticas em tempo real</p>
              </div>
            </button>
          </div>
        ) : null}

        {tela === 'treino' ? (
          <section className="panel">
            <button className="back" onClick={() => setTela('inicio')}>← Início</button>
            <div className="stats">
              <div><strong>29</strong><span>Semanas</span></div>
              <div><strong>126</strong><span>Exercícios</span></div>
              <div><strong>{resumo.totalSeries}</strong><span>Séries</span></div>
            </div>
            <p className="strip">Configure seu ciclo para ver estimativas</p>
            <div className="tabs">
              {['pernaA', 'pernaB', 'bracos', 'costas', 'peito', 'comparar'].map((t) => (
                <button key={t} className={aba === t ? 'active' : ''} onClick={() => setAba(t)}>
                  {t === 'pernaA' ? 'Perna A' : t === 'pernaB' ? 'Perna B' : t === 'bracos' ? 'Braços' : t === 'costas' ? 'Costas' : t === 'peito' ? 'Peito' : 'Comparar'}
                </button>
              ))}
            </div>

            {aba !== 'comparar' ? (
              <div className="week-grid">
                {treinoSemanas.map((item) => (
                  <article key={item.semana}>
                    <h4>{item.semana}</h4>
                    <p>{item.series} séries</p>
                    <strong>{item.carga || '-'} kg</strong>
                  </article>
                ))}
                <p className="gain">Ganho estimado: +{resumo.ganho}%</p>
              </div>
            ) : (
              <div className="compare-list">
                {modulos.map((m) => (
                  <article key={m.nome}>
                    <i style={{ background: m.cor }} />
                    <div>
                      <h4>{m.nome}</h4>
                      <p>{m.exercicio}</p>
                    </div>
                    <strong style={{ color: m.cor }}>{m.ganho}</strong>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {tela === 'relatorio' ? (
          <section className="panel">
            <button className="back" onClick={() => setTela('inicio')}>← Início</button>
            <h2>Progressão por semana</h2>
            <div className="bars">
              {treinoSemanas.map((w) => (
                <div key={w.semana}>
                  <em>{w.series}</em>
                  <div
                    style={{
                      height: `${Math.max(w.series * 8, 6)}px`,
                      background: w.status === 'deload' ? '#7fb07f' : w.status === 'pre' ? '#c4584f' : '#0a4a83'
                    }}
                  />
                  <span>{w.semana}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {tela === 'sync' ? (
          <section className="panel">
            <button className="back" onClick={() => setTela('inicio')}>← Início</button>
            <h2>Sincronização automática</h2>
            <p className="helper">Tudo que aluno ou personal enviar aparece para ambos automaticamente.</p>

            <form className="sync-form" onSubmit={enviarAtualizacao}>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="aluno">Aluno</option>
                <option value="personal">Personal</option>
              </select>
              <input
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Ex.: Completei 4x12 no leg press"
              />
              <button type="submit">Enviar</button>
            </form>

            <div className="feed">
              {logs.map((log, i) => (
                <div key={`${log.horario}-${i}`} className={`bubble ${log.origem}`}>
                  <small>{log.origem === 'aluno' ? 'Aluno' : 'Personal'} · {log.horario}</small>
                  <p>{log.texto}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
