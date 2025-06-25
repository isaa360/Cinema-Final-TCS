import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CadastroFilmes from './pages/CadastroFilmes';
import CadastroSalas from './pages/CadastroSalas';
import CadastroSessoes from './pages/CadastroSessoes';
import VendaIngressos from './pages/VendaIngressos';
import ListagemSessoes from './pages/ListagemSessoes'; 
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="nav-link">Início</Link>
          <Link to="/cadastro-filmes" className="nav-link">Cadastro de Filmes</Link>
          <Link to="/cadastro-salas" className="nav-link">Cadastro de Salas</Link>
          <Link to="/cadastro-sessoes" className="nav-link">Cadastro de Sessões</Link>
          <Link to="/venda-ingressos" className="nav-link">Venda de Ingressos</Link>
          <Link to="/sessoes-disponiveis" className="nav-link">Sessões Disponíveis</Link> 
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-filmes" element={<CadastroFilmes />} />
            <Route path="/cadastro-salas" element={<CadastroSalas />} />
            <Route path="/cadastro-sessoes" element={<CadastroSessoes />} />
            <Route path="/venda-ingressos" element={<VendaIngressos />} />
            <Route path="/sessoes-disponiveis" element={<ListagemSessoes />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;