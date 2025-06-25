import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListagemSessoes.css';

function ListagemSessoes() {
  const navigate = useNavigate();
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessoes = async () => {
      try {
        const response = await fetch('/api/sessoes');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        setSessoes(data);
      } catch (err) {
        console.error("Erro ao buscar sessões:", err);
        setError("Falha ao carregar sessões.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessoes();
  }, []);

  const handleComprarIngresso = (sessionId) => {
    navigate('/venda-ingressos', { state: { sessionId } });
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="listagem-sessoes-container">Carregando sessões...</div>;
  }

  if (error) {
    return <div className="listagem-sessoes-container error-message">{error}</div>;
  }

  return (
    <div className="listagem-sessoes-container">
      <h2>Sessões Disponíveis</h2>
      {sessoes.length === 0 ? (
        <p>Nenhuma sessão disponível no momento.</p>
      ) : (
        <div className="sessoes-grid">
          {sessoes.map((sessao) => (
            <div key={sessao.id} className="sessao-card">
              <h3>{sessao.movie.title}</h3>
              <p><strong>Sala:</strong> {sessao.room.name} ({sessao.room.type})</p>
              <p><strong>Data e Hora:</strong> {formatDateTime(sessao.dateTime)}</p>
              <p><strong>Preço:</strong> R$ {sessao.price ? sessao.price.toFixed(2) : '0.00'}</p>
              <p><strong>Idioma:</strong> {sessao.language}</p>
              <p><strong>Formato:</strong> {sessao.format}</p>
              <button
                onClick={() => handleComprarIngresso(sessao.id)}
                className="comprar-ingresso-btn"
              >
                Comprar Ingresso
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListagemSessoes;