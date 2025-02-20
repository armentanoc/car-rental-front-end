// src/components/ManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ManagerDashboard.css';

const fetchPendingRequests = async () => {
  try {
    const response = await fetch('http://localhost:8090/requests/pending', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    const responseLog = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao buscar solicitações pendentes: ' + responseLog.message);
    }

    return responseLog;
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
};

const fetchApprovedRequests = async () => {
  try {
    const response = await fetch('http://localhost:8090/requests/approved', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    const responseLog = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao buscar solicitações aprovadas: ' + responseLog.message);
    }

    return responseLog;
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
};

const fetchRejectedRequests = async () => {
  try {
    const response = await fetch('http://localhost:8090/requests/rejected', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    const responseLog = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao buscar solicitações rejeitadas: ' + responseLog.message);
    }

    return responseLog;
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
};

const approveRequest = async (requestId, userId) => {
  try {
    const response = await fetch(`http://localhost:8090/requests/${requestId}/approval`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, isApproved: true }),
    });

    if (!response.ok) {
      const responseLog = await response.json();
      throw new Error(responseLog.message);
    }

    return requestId; // Retorna o requestId se a aprovação for bem-sucedida
  } catch (error) {
    console.error(error);
    alert('Erro: ' + error.message);
    return null;
  }
};

const fetchSpaces = async () => {
  try {
    const response = await fetch('http://localhost:8090/locations', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    const responseLog = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao buscar espaços físicos: ' + responseLog.message);
    }

    return responseLog;
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
};

const rejectRequest = async (requestId, userId) => {
  try {
    const response = await fetch(`http://localhost:8090/requests/${requestId}/approval`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, isApproved: false }),
    });

    if (!response.ok) {
      const responseLog = await response.json();
      throw new Error(responseLog.message);
    }

    return requestId; // Retorna o requestId se a rejeição for bem-sucedida
  } catch (error) {
    console.error(error);
    alert('Erro: ' + error.message);
    return null;
  }
};

const ManagerDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const { user, logout } = useAuth(); // Obtém o usuário atual e a função de logout do contexto
  const navigate = useNavigate(); // Usa o hook de navegação

  const handleLogout = () => {
    logout(); // Executa o logout
    navigate('/login'); // Redireciona para a página de login
  };

  const loadData = async () => {
    const requestsData = await fetchPendingRequests();
    const approvedData = await fetchApprovedRequests();
    const rejectedData = await fetchRejectedRequests();
    const spacesData = await fetchSpaces();

    setPendingRequests(requestsData);
    setApprovedRequests(approvedData);
    setRejectedRequests(rejectedData);
    setSpaces(spacesData);
  };

  const handleApprove = async (requestId) => {
    const approvedId = await approveRequest(requestId, user.id);
    if (approvedId) {
      setPendingRequests(pendingRequests.filter(request => request.id !== approvedId));
      alert('Solicitação aprovada com sucesso.');
      loadData();
    }
  };

  const handleReject = async (requestId) => {
    const rejectedId = await rejectRequest(requestId, user.id);
    if (rejectedId) {
      setPendingRequests(pendingRequests.filter(request => request.id !== rejectedId));
      alert('Solicitação rejeitada com sucesso.');
      loadData();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h2>Painel do Gestor</h2>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </div>
      <p>Bem-vindo ao painel do gestor, {user.name.split(' ')[0]}! Aqui você pode gerenciar as solicitações de uso de espaço físico.</p>

      <h3>Solicitações Pendentes</h3>
      {pendingRequests.length === 0 ? (
        <p>Nenhuma solicitação pendente.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID da Solicitação</th>
              <th>ID do Local</th>
              <th>ID do Usuário</th>
              <th>Razão</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.locationId}</td>
                <td>{request.userId}</td>
                <td>{request.reason}</td>
                <td>{new Date(request.startTime).toLocaleString()}</td>
                <td>{new Date(request.endTime).toLocaleString()}</td>
                <td>{request.status}</td>
                <td className='botoes-div'>
                  <button onClick={() => handleApprove(request.id)}>Aprovar</button>
                  <button onClick={() => handleReject(request.id)}>Rejeitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Solicitações Aprovadas</h3>
      {approvedRequests.length === 0 ? (
        <p>Nenhuma solicitação aprovada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID da Solicitação</th>
              <th>ID do Local</th>
              <th>ID do Usuário</th>
              <th>Razão</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.locationId}</td>
                <td>{request.userId}</td>
                <td>{request.reason}</td>
                <td>{new Date(request.startTime).toLocaleString()}</td>
                <td>{new Date(request.endTime).toLocaleString()}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Solicitações Rejeitadas</h3>
      {rejectedRequests.length === 0 ? (
        <p>Nenhuma solicitação rejeitada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID da Solicitação</th>
              <th>ID do Local</th>
              <th>ID do Usuário</th>
              <th>Razão</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rejectedRequests.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.locationId}</td>
                <td>{request.userId}</td>
                <td>{request.reason}</td>
                <td>{new Date(request.startTime).toLocaleString()}</td>
                <td>{new Date(request.endTime).toLocaleString()}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Espaços Físicos</h3>
      {spaces.length === 0 ? (
        <p>Nenhum espaço disponível no momento.</p>
      ) : (
        <ul>
          {spaces.map(space => (
            <li key={space.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                Id: {space.id} - Nome: {space.description} - Capacidade: {space.capacity} pessoas - Localização: {space.location} - Tipo: {space.locationType} - Recursos: {space.resources}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagerDashboard;
