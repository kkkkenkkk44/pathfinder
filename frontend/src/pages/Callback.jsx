// frontend/src/pages/Callback.js
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

export default function Callback() {
  const navigate = useNavigate();
  const { setGithubToken } = useContext(AppContext);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      axios.post(import.meta.env.VITE_API_BASE_URL + '/auth/github/callback', { code }).then(res => {
        const token = res.data.access_token;
        localStorage.setItem('github_token', token);
        setGithubToken(token);
        navigate('/dashboard');
      });
    }
  }, []);

  return <div>Logging in with GitHub...</div>;
}
