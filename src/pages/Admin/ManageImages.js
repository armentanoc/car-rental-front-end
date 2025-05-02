// src/pages/admin/ManageImages.js
import React, { useState } from 'react';
import { ImageAPI } from '../../components/Admin/api'; 
import { useAuth } from '../../context/AuthContext';
import ImageForm from '../../components/Admin/ImageForm';

const ManageImages = () => {
  const [newImage, setNewImage] = useState({ url: '', vehicleId: '', description: '' });
  const [vehicleImages, setVehicleImages] = useState({});
  useAuth();

  const handleAddImageUrl = async () => {
    const { url, vehicleId, description } = newImage;

    if (!url || !vehicleId || !description) {
      alert('Por favor, preencha todos os campos da imagem.');
      return;
    }

    try {
      await ImageAPI.addImage({ vehicleId, url, description });
      alert('Imagem adicionada com sucesso!');
      setNewImage({ url: '', vehicleId: '', description: '' });
      await fetchVehicleImages(vehicleId);
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error);
      alert(error.message || 'Erro ao adicionar imagem.');
    }
  };

  const fetchVehicleImages = async (vehicleId) => {
    try {
      const data = await ImageAPI.fetchVehicleImages(vehicleId);
      if (Array.isArray(data)) {
        setVehicleImages(prev => ({ ...prev, [vehicleId]: data }));
      }
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
    }
  };
  
  const handleRemoveImage = async (imageId, vehicleId) => {
    try {
      await ImageAPI.removeImage(imageId);
      setVehicleImages(prev => ({
        ...prev,
        [vehicleId]: prev[vehicleId].filter(img => img.imageId !== imageId),
      }));
      alert('Imagem removida com sucesso!');
    } catch (err) {
      console.error('Erro ao remover imagem:', err);
      alert('Erro ao remover imagem.');
    }
  };
  
  return (
    <div>
      <ImageForm newImage={newImage} setNewImage={setNewImage} onAddImage={handleAddImageUrl} />
      {Object.entries(vehicleImages).map(([vehicleId, images]) => (
        <div key={vehicleId}>
          <h4>Imagens do veículo {vehicleId}</h4>
          <ul>
            {images.map(image => (
              <li key={image.imageId}>
                <img src={image.url} alt={image.description} width="120" />
                <p>{image.description}</p>
                <button onClick={() => handleRemoveImage(image.imageId, vehicleId)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ManageImages;
