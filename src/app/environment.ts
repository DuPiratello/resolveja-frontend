
export const environment = {
  production: false,
  apiUrl: ''
};

// Detecta automaticamente o ambiente
export function getApiUrl(): string {
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
  
  if (isLocal) {
    return 'http://localhost:5000'; // Para desenvolvimento local
  } else {
    return 'https://resolveja-backend-134601635282.southamerica-east1.run.app'; // Para produção
  }
}
