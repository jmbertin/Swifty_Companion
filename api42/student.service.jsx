import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.intra.42.fr',
});

export async function rechercheEtudiant(token: string, query: string): Promise<any> {
  try {
    const response = await api.get('/v2/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        filter: { query },
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

