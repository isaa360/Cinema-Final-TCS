import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Início</Link>
      <Link to="/cadastro-filmes" className="nav-link">Cadastro de Filmes</Link>
      <Link to="/cadastro-salas" className="nav-link">Cadastro de Salas</Link>
      <Link to="/cadastro-sessoes" className="nav-link">Cadastro de Sessões</Link>
      <Link to="/venda-ingressos" className="nav-link">Venda de Ingressos</Link>
      <Link to="/sessoes-disponiveis" className="nav-link">Sessões Disponíveis</Link>
    </nav>
  );
}

export default Navbar;