import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import ReactToast from '../../components/Toast/Toast';
import { useState } from 'react';
import { postRequest } from '../../helpers/api.helpers';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const prefix = import.meta.env.VITE_BACKEND_API;

  const handleLogin = async () => {
    try {
      const response = await postRequest(`${prefix}/login`, credentials) as {token: string};
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      }
      console.log('Login response:', response);
    } catch (error) {
      console.log('Error in Login', error);
      setToastMessage('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#1C192A',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      {toastMessage && <ReactToast toastMessage={toastMessage} />}

      <Card sx={{ minWidth: 350, p: 3, borderRadius: 3, bgcolor: '#2C2A3A', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center" fontWeight={600} sx={{ marginBottom: 2 }}>
            Trading Assistant
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Username"
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              variant="outlined"
              fullWidth
              InputProps={{
                sx: { color: 'white' },
              }}
              InputLabelProps={{
                sx: { color: 'white' },
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              variant="outlined"
              fullWidth
              InputProps={{
                sx: { color: 'white' },
              }}
              InputLabelProps={{
                sx: { color: 'white' },
              }}
            />
            <Button
              onClick={handleLogin}
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                mt: 2,
                bgcolor: '#1E8E8E',
                '&:hover': { bgcolor: '#5b52e6' },
                color: 'white',
              }}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
export default Login;