// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Importando o AuthProvider
import './App.css'; // Importando estilos globais

// Renderiza o aplicativo React
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider> {/* Envolvendo o App com AuthProvider para fornecer dados de autenticação */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root') // Local onde o aplicativo será montado no DOM
);
