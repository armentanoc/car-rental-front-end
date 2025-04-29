import React from 'react';

const ImageForm = ({ newImage, setNewImage, onAddImage }) => {
  return (
    <div>
      <h3>Adicionar Imagem ao Veículo</h3>
      <input
        type="text"
        placeholder="URL da Imagem"
        value={newImage.url}
        onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
      />
      <input
        type="text"
        placeholder="ID do Veículo"
        value={newImage.vehicleId}
        onChange={(e) => setNewImage({ ...newImage, vehicleId: e.target.value })}
      />
      <input
        type="text"
        placeholder="Descrição da Imagem"
        value={newImage.description}
        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
      />
      <button className="input-button" onClick={onAddImage}>Adicionar Imagem</button>
    </div>
  );
};

export default ImageForm;
