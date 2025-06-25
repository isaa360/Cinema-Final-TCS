import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadastroSalas.css'; 

function CadastroSalas() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    type: '2D', 
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
      const response = await fetch('/api/salas', {
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
      setMessage(`Sala "${result.name}" cadastrada com sucesso!`);
      setFormData({ // Limpa o formulário
        name: '',
        capacity: '',
        type: '2D',
      });
    } catch (err) {
      console.error("Erro ao cadastrar sala:", err);
      setError(`Erro ao cadastrar sala: ${err.message}`);
    }
  };

  return (
    <div className="cadastro-salas-container">
      <h2>Cadastro de Salas</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="cadastro-salas-form">
        <div className="form-group">
          <label htmlFor="name">Nome da Sala:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacidade:</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Tipo:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="IMAX">IMAX</option>
          </select>
        </div>
        <button type="submit">Salvar Sala</button>
      </form>
    </div>
  );
}

export default CadastroSalas;