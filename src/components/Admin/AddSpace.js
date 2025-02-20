import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSpace = ({ onSaveEdit, defaultValues, onSpaceAdded, adminId }) => {
  const [newSpace, setNewSpace] = useState({ 
    locationType: 'SALA', 
    description: '',
    capacity: '',
    location: '',
    resources: ''
  });

  useEffect(() => {
    // Se houver valores padrão, configura o estado com eles
    if (defaultValues) {
      setNewSpace(defaultValues); 
    }
  }, [defaultValues]);

  // Função para adicionar um novo espaço
  const handleAddSpace = async () => {
    try {
      console.log('Sending data:', {
        locationType: newSpace.locationType,
        description: newSpace.description,
        capacity: Number(newSpace.capacity),
        location: newSpace.location,
        resources: newSpace.resources,
        adminId
      });

      const response = await axios.post('http://localhost:8090/locations', {
        locationType: newSpace.locationType,
        description: newSpace.description,
        capacity: Number(newSpace.capacity),
        location: newSpace.location,
        resources: newSpace.resources,
        adminId
      });
      
      // Reseta o formulário sem notificar o pai
      setNewSpace({ locationType: 'SALA', description: '', capacity: '', location: '', resources: '' });
      alert('Novo espaço cadastrado com sucesso!');
      onSpaceAdded(); // Notifica o pai que um novo espaço foi adicionado
      
      // Opcional: Loga a resposta se necessário
      console.log('Novo espaço criado:', response.data);
    } catch (error) {
      console.error('Erro ao adicionar espaço:', error);
      alert('Falha ao cadastrar o espaço. Tente novamente.');
    }
  };

  // Função para salvar a edição do espaço
  const handleSaveSpaceEdit = async () => {

    if (!newSpace.id) {
      alert('ID do espaço não encontrado.');
      return; 
    }
    
    try {
      console.log('Atualizando espaço:', newSpace);

      const response = await axios.patch(`http://localhost:8090/locations/${newSpace.id}`, {
        locationType: newSpace.locationType,
        description: newSpace.description,
        capacity: Number(newSpace.capacity),
        location: newSpace.location,
        resources: newSpace.resources,
        adminId
      });

      // Reseta o formulário após salvar a edição
      setNewSpace({ locationType: 'SALA', description: '', capacity: '', location: '', resources: '' });
      alert('Espaço atualizado com sucesso!');
      onSaveEdit(response.data); // Notifica o pai com os dados atualizados

      console.log('Espaço atualizado:', response.data);
    } catch (error) {
      console.error('Erro ao atualizar espaço:', error);
      alert('Falha ao atualizar o espaço. Tente novamente.');
    }
  };

  return (
    <div>
      <select
        value={newSpace.locationType}
        onChange={(e) => setNewSpace({ ...newSpace, locationType: e.target.value })}
      >
        <option value="SALA">Sala</option>
        <option value="LABORATORIO">Laboratório</option>
        <option value="AUDITORIO">Auditório</option>
      </select>
      <input
        type="text"
        placeholder="Descrição"
        value={newSpace.description}
        onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Capacidade"
        value={newSpace.capacity}
        onChange={(e) => setNewSpace({ ...newSpace, capacity: e.target.value })}
      />
      <input
        type="text"
        placeholder="Localização"
        value={newSpace.location}
        onChange={(e) => setNewSpace({ ...newSpace, location: e.target.value })}
      />
      <input
        type="text"
        placeholder="Recursos"
        value={newSpace.resources}
        onChange={(e) => setNewSpace({ ...newSpace, resources: e.target.value })}
      />
      <button onClick={newSpace.id ? handleSaveSpaceEdit : handleAddSpace}>
        {newSpace.id ? 'Salvar Edição' : 'Cadastrar Espaço'}
      </button>
    </div>
  );
};

export default AddSpace;
