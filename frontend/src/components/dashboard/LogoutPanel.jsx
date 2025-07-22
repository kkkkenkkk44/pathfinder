import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('github_token');
    navigate('/login');
  }, [navigate]);

  return <p>Logging out...</p>;
}
