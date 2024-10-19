import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/', // backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensures cookies (for session management) are included
});

export default instance;
