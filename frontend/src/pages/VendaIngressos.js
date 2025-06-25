import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VendaIngressos.css';

function VendaIngressos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessoes, setSessoes] = useState([]);
  const [formData, setFormData] = useState({
    sessionId: '',
    clientName: '',
    clientCpf: '',
    seat: '',
    paymentType: 'Cartão',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessoes = async () => {
      try {
        const response = await fetch('/api/sessoes');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        setSessoes(data);

        if (location.state && location.state.sessionId) {
          setFormData((prev) => ({ ...prev, sessionId: location.state.sessionId }));
        } else if (data.length > 0) {
          setFormData((prev) => ({ ...prev, sessionId: data[0].id }));
        }
      } catch (err) {
        console.error("Erro ao carregar sessões:", err);
        setError("Falha ao carregar sessões.");
      }
    };

    fetchSessoes();
  }, [location.state]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/ingressos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP! Status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(`Ingresso para o cliente ${result.clientName} vendido com sucesso!`);
      setFormData({ 
        sessionId: location.state && location.state.sessionId ? location.state.sessionId : (sessoes.length > 0 ? sessoes[0].id : ''),
        clientName: '',
        clientCpf: '',
        seat: '',
        paymentType: 'Cartão',
      });
    } catch (err) {
      console.error("Erro ao vender ingresso:", err);
      setError(`Erro ao vender ingresso: ${err.message}`);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="venda-ingressos-container">
      <h2>Venda de Ingressos</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="venda-ingressos-form">
        <div className="form-group">
          <label htmlFor="sessionId">Sessão:</label>
          <select
            id="sessionId"
            name="sessionId"
            value={formData.sessionId}
            onChange={handleChange}
            required
            disabled={sessoes.length === 0}
          >
            {sessoes.length === 0 && <option value="">Carregando sessões...</option>}
            {sessoes.map((sessao) => (
              <option key={sessao.id} value={sessao.id}>
                {sessao.movie.title} - {sessao.room.name} ({formatDateTime(sessao.dateTime)}) - R$ {sessao.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="clientName">Nome do Cliente:</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="clientCpf">CPF:</label>
          <input
            type="text"
            id="clientCpf"
            name="clientCpf"
            value={formData.clientCpf}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="seat">Assento (ex: A10):</label>
          <input
            type="text"
            id="seat"
            name="seat"
            value={formData.seat}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentType">Tipo de Pagamento:</label>
          <select
            id="paymentType"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            required
          >
            <option value="Cartão">Cartão</option>
            <option value="Pix">Pix</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>
        <button type="submit">Confirmar Venda</button>
      </form>
    </div>
  );
}

export default VendaIngressos;