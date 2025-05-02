const UserTable = ({ users, onRemoveUser, onEditUser }) => {
  return (
    <div>
      <h3>Gestão de Usuários</h3>
      {users.length === 0 ? (
        <p>Carregando usuários...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Perfil</th>
              <th>Email</th>
              <th>Usuário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button className="edit-button" onClick={() => onEditUser(user)} style={{ marginRight: '5px' }}>
                    Editar
                  </button>
                  <button className="remove-button" onClick={() => onRemoveUser(user.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable; 