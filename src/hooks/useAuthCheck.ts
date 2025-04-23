import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../src/utils/jwt.helper'; 

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkToken(); // Initial check on mount
    const interval = setInterval(checkToken, 10000); // Check every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [navigate]);
};
