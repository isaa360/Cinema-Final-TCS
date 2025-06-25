import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadastroSessoes.css'; 

function CadastroSessoes() {
  const navigate = useNavigate();
  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [formData, setFormData] = useState({
    movieId: '',
    roomId: '',
    dateTime: '',
    price: '',
    language: 'Dublado',
    format: '2D',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Buscar filmes
    const fetchFilmes = async () => {
      try {
        const response = await fetch('/api/filmes');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        setFilmes(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, movieId: data[0].id }));
        }
      } catch (err) {
        console.error("Erro ao carregar filmes:", err);
        setError("Falha ao carregar filmes.");
      }
    };

    // Buscar salas
    const fetchSalas = async () => {
      try {
        const response = await fetch('/api/salas');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        setSalas(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, roomId: data[0].id }));
        }
      } catch (err) {
        console.error("Erro ao carregar salas:", err);
        setError("Falha ao carregar salas.");
      }
    };

    fetchFilmes();
    fetchSalas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/sessoes', {
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
      setMessage(`Sessão cadastrada com sucesso!`);
      setFormData({ 
        movieId: filmes.length > 0 ? filmes[0].id : '',
        roomId: salas.length > 0 ? salas[0].id : '',
        dateTime: '',
        price: '',
        language: 'Dublado',
        format: '2D',
      });
    } catch (err) {
      console.error("Erro ao cadastrar sessão:", err);
      setError(`Erro ao cadastrar sessão: ${err.message}`);
    }
  };

  return (
    <div className="cadastro-sessoes-container">
      <h2>Cadastro de Sessões</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="cadastro-sessoes-form">
        <div className="form-group">
          <label htmlFor="movieId">Filme:</label>
          <select
            id="movieId"
            name="movieId"
            value={formData.movieId}
            onChange={handleChange}
            required
            disabled={filmes.length === 0}
          >
            {filmes.length === 0 && <option value="">Carregando filmes...</option>}
            {filmes.map((filme) => (
              <option key={filme.id} value={filme.id}>
                {filme.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="roomId">Sala:</label>
          <select
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            disabled={salas.length === 0}
          >
            {salas.length === 0 && <option value="">Carregando salas...</option>}
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.name} (Cap.: {sala.capacity}, Tipo: {sala.type})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateTime">Data e Hora:</label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="language">Idioma:</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          >
            <option value="Dublado">Dublado</option>
            <option value="Legendado">Legendado</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="format">Formato:</label>
          <select
            id="format"
            name="format"
            value={formData.format}
            onChange={handleChange}
            required
          >
            <option value="2D">2D</option>
            <option value="3D">3D</option>
          </select>
        </div>
        <button type="submit">Salvar Sessão</button>
      </form>
    </div>
  );
}

export default CadastroSessoes;