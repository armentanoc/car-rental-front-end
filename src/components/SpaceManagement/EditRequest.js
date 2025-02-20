// src/components/SpaceManagement/EditRequest.js
import React, { useState } from 'react';

const EditRequest = () => {
  const [requestId, setRequestId] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const handleEdit = (e) => {
    e.preventDefault();
    // Lógica para editar a solicitação
    alert(`Solicitação ${requestId} editada com os novos detalhes: "${newDetails}"`);
  };

  return (
    <div>
      <h2>Editar Solicitação</h2>
      <form onSubmit={handleEdit}>
        <input 
          type="text" 
          placeholder="ID da Solicitação" 
          value={requestId} 
          onChange={(e) => setRequestId(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Novos Detalhes" 
          value={newDetails} 
          onChange={(e) => setNewDetails(e.target.value)} 
          required 
        />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditRequest;
