
export const environment = {
  production: false,
  apiUrl: getApiUrl()
};

function getApiUrl(): string {
  // Se estiver em produção (hospedado)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://resolveja-backend-134601635282.southamerica-east1.run.app';
  }
  
  // Se estiver em desenvolvimento (local)
  return 'http://localhost:5000';
}
