import React, { useState, useEffect } from 'react';
import '../styles/TeacherDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // Importa o axios

const TeacherDashboard = () => {
  const { user, logout } = useAuth(); // Obtém o usuário e a função de logout
  const [locationId, setLocationId] = useState(''); // Estado para armazenar o ID da localização
  const [startTime, setStartTime] = useState(''); // Estado para armazenar o horário de início
  const [endTime, setEndTime] = useState(''); // Estado para armazenar o horário de término
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]); // Estado para armazenar as solicitações realizadas
  const [locations, setLocations] = useState([]); // Estado para armazenar as localizações
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Executa logout
    navigate('/login'); // Redireciona para a página de login
  };

  const handleRequest = async (e) => {
    e.preventDefault();

    const newRequest = {
      userId: user.id, // Obtém o ID do usuário autenticado
      locationId: parseInt(locationId), // Converte o ID da localização para número
      startTime: new Date(startTime).toUTCString(), // A hora de início no formato UTC
      endTime: new Date(endTime).toUTCString(), // A hora de término no formato UTC
      reason: reason || "Nenhuma necessidade específica fornecida", // Usa specificNeeds ou uma mensagem padrão
    };

    try {
      // Envia a solicitação para o servidor
      const response = await axios.post('http://localhost:8090/requests', newRequest);
      console.log('Solicitação enviada com sucesso:', response.data);
      alert('Solicitação enviada com sucesso.');

      // Limpa os campos do formulário
      setLocationId(''); // Limpa o ID da localização
      setStartTime(''); // Limpa o horário de início
      setEndTime(''); // Limpa o horário de término
      setReason(''); // Limpa as necessidades específicas

      // Atualiza a lista de solicitações
      fetchRequests();
    } catch (error) {
      console.error('Erro ao enviar a solicitação:', error);
      alert('Erro ao enviar a solicitação:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/users/${user.id}/requests`);
      console.log(response);
      setRequests(response.data); // Armazena as solicitações realizadas
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      alert('Erro ao buscar solicitações:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8090/locations');
      if (!response.ok) {
        throw new Error('Erro ao buscar locais');
      }
      const spaces = await response.json();
      setLocations(spaces); // Armazena as localizações
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar localizações:', error);
    }
  };

  useEffect(() => {
    fetchRequests(); // Busca as solicitações quando o componente é montado
    fetchLocations(); // Busca as localizações quando o componente é montado
  }, [user.id]);

  return (
    <div className="teacher-dashboard">
      <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Botão de logout */}
      
      <h2>Painel do Professor</h2>
      <p>Bem-vindo ao painel do professor, {user.name.split(' ')[0]}!</p>

      <h3>Solicitar Alocação de Espaço</h3>
      <form onSubmit={handleRequest}>
        <select 
          value={locationId} 
          onChange={(e) => setLocationId(e.target.value)} 
          required
        >
          <option value="" disabled>Selecione o Local</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              Id: {location.id} - Tipo: {location.locationType} - Descrição: {location.description} - Capacidade: {location.capacity} - Recursos: {location.resources}
            </option>
          ))}
        </select>
        <input 
          type="datetime-local" 
          value={startTime} 
          onChange={(e) => setStartTime(e.target.value)} 
          required 
        />
        <input 
          type="datetime-local" 
          value={endTime} 
          onChange={(e) => setEndTime(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Razão" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
        />
        <button type="submit">Solicitar</button>
      </form>

      <h3>Solicitações Realizadas</h3>
      <ul>
        {requests.map(request => (
          <li key={request.id}>
            <div>
              <strong>ID do Local:</strong> {request.locationId} <br />
              <strong>Início:</strong> {new Date(request.startTime).toLocaleString()} <br />
              <strong>Fim:</strong> {new Date(request.endTime).toLocaleString()} <br />
              <strong>Razão:</strong> {request.reason} <br/>
              <strong>Status:</strong> {request.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherDashboard;
