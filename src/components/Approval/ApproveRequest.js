// src/components/ApproveRequest.js
import React from 'react';

const ApproveRequest = () => {
  const handleApprove = () => {
    // Lógica para aprovar a solicitação
    alert('Solicitação aprovada!');
  };

  return (
    <div>
      <h2>Aprovar Solicitação</h2>
      <button onClick={handleApprove}>Aprovar Solicitação</button>
    </div>
  );
};

export default ApproveRequest;
