import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../utils/jwt.helper';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

const ChatLayout = () => {
  useAuthCheck(); // Custom hook to check token expiration
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  },[]);

  const handleSend = () => {
    console.log('Message:', message);
    console.log('Attached File:', file);
    setMessage('');
    setFile(null);
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      // TradingView widget initialization
      new (window as any).TradingView.widget({
        width: '100%',
        height: '100%',
        symbol: 'NASDAQ:AAPL',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_widget',
      });
    };

    const container = document.getElementById('tv-script-container');
      if (container) {
        container.appendChild(script);
      }
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1C192A' }}>
      {/* Left - TradingView widget (75%) */}
      <Box sx={{ flex: 3, p: 2 }}>
        <Box
          id="tv-script-container"
          sx={{ width: '100%', height: '100%' }}
        >
          <div id="tradingview_widget" style={{ height: '100%' }} />
        </Box>
      </Box>

      {/* Right - Chat Box (25%) */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#1C192A',
          color: 'white',
          borderLeft: '1px solid #333',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chat with Assistant
        </Typography>

        <Paper
          sx={{
            flex: 1,
            mb: 2,
            p: 2,
            overflowY: 'auto',
            bgcolor: '#2C2A3A',
            color: 'white',
          }}
        >
          {/* Messages display area */}
          <Typography variant="body2" color="white">
            No messages yet.
          </Typography>
        </Paper>

        {/* Message input section */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="Type your message..."
            InputProps={{
              sx: {
                color: 'white',
              },
            }}
            InputLabelProps={{
              sx: {
                color: 'white',
              },
            }}
          />
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <IconButton component="label" htmlFor="file-upload" sx={{ color: 'white' }}>
            <AttachFileIcon />
          </IconButton>
          <IconButton onClick={handleSend} sx={{ color: 'white' }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatLayout;
