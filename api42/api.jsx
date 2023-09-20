import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET } from '@env'

const api = axios.create({
  baseURL: 'https://api.intra.42.fr/v2',
});

export const api42 = {
  authURL: 'https://api.intra.42.fr/oauth/authorize',
  tokenURL: 'https://api.intra.42.fr/oauth/token',
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'swiftycompanion://callback',

  getAuthURL: function () {
    return `${this.authURL}?client_id=${
      this.clientId
    }&redirect_uri=${encodeURIComponent(
      this.redirectUri,
    )}&response_type=code&scope=public`;
  },

  async getAccessToken(code: string) {
    try {
      const response = await axios.post(this.tokenURL, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.log('Error getting token', error);
      throw error;
    }
  },

  async getUserProfile(accessToken: string) {
    try {
      const response = await api.get('me', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      // console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.log('Error fetching profile datas', error);
      throw error;
    }
  },
  async getUserbyLogin(accessToken: string, login: string) {
    try {
      const response = await api.get(`users/${login}`, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      return response.data;
    } catch (error) {
      console.log('Erreur lors de la récupération du profil', error);
      throw error;
    }
  },
};

export default api42;
