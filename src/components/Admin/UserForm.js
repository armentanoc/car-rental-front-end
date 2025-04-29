import React from 'react';

const UserForm = ({ newUser, setNewUser, onRegisterUser, editMode }) => {
  return (
    <div>
      <h3>{editMode ? 'Editar Usuário' : 'Registrar Novo Usuário'}</h3>
      <input type="text" placeholder="Nome" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
      <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
      <input type="text" placeholder="Usuário" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
      <input type="password" placeholder="Senha" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
      <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
        <option value="CLIENT">Cliente</option>
        <option value="ATTENDING">Atendimento</option>
        <option value="MANAGER">Gerente</option>
        <option value="ADMIN">Administrador</option>
      </select>
      <button className="input-button" onClick={onRegisterUser}>
        {editMode ? 'Salvar Edição' : 'Registrar'}
      </button>
    </div>
  );
};

export default UserForm;
