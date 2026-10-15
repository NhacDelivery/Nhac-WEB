export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoriaMenu: string;
  imagemUrl?: string;
  percentualDesconto?: number;
  lojaId?: string;
}

export interface AuthResponse {
  token: string;
  usuarioId: string;
  nome: string;
}

const API_BASE_URL = 'https://backend-nhac.cloud.run/api/v1';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const login = async (email: string, senha: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const data: AuthResponse = await response.json();
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuarioId', data.usuarioId);
    localStorage.setItem('nome', data.nome);

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioId');
  localStorage.removeItem('nome');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const fetchProdutos = async (categoria: string = 'Todos'): Promise<Produto[]> => {
  try {
    let url = `${API_BASE_URL}/produtos?size=50`;
    if (categoria && categoria !== 'Todos') {
      url += `&categoriaMenu=${encodeURIComponent(categoria)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content || data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};
