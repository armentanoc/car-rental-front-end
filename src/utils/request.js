export const apiRequest = async (url, method = 'GET', body = null) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: body ? JSON.stringify(body) : null,
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro desconhecido');
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  