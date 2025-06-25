import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './CadastroFilmes.css';

function CadastroFilmes() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Ação',
    rating: 'Livre', 
    duration: '',
    releaseDate: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/filmes', {
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
      setMessage(`Filme "${result.title}" cadastrado com sucesso!`);
      setFormData({ 
        title: '',
        description: '',
        genre: 'Ação',
        rating: 'Livre',
        duration: '',
        releaseDate: '',
      });

    } catch (err) {
      console.error("Erro ao cadastrar filme:", err);
      setError(`Erro ao cadastrar filme: ${err.message}`);
    }
  };

  return (
    <div className="cadastro-filmes-container">
      <h2>Cadastro de Filmes</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="cadastro-filmes-form">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="genre">Gênero:</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          >
            <option value="Ação">Ação</option>
            <option value="Comédia">Comédia</option>
            <option value="Drama">Drama</option>
            <option value="Ficção Científica">Ficção Científica</option>
            <option value="Terror">Terror</option>
            <option value="Animação">Animação</option>
            <option value="Documentário">Documentário</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="rating">Classificação Indicativa:</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="Livre">Livre</option>
            <option value="10+">10 anos</option>
            <option value="12+">12 anos</option>
            <option value="14+">14 anos</option>
            <option value="16+">16 anos</option>
            <option value="18+">18 anos</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duração (minutos):</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Data de Estreia:</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Salvar Filme</button>
      </form>
    </div>
  );
}

export default CadastroFilmes;