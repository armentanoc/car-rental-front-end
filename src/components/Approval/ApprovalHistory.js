// src/components/ApprovalHistory.js
import React from 'react';

const ApprovalHistory = () => {
  const history = [
    { id: 1, status: 'Aprovado', date: '2024-09-20' },
    { id: 2, status: 'Rejeitado', date: '2024-09-21' },
  ];

  return (
    <div>
      <h2>Histórico de Aprovações</h2>
      <ul>
        {history.map(item => (
          <li key={item.id}>
            {item.date} - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovalHistory;
