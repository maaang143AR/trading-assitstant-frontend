import { useState, useEffect } from 'react';
import { Box, TextField, Typography, IconButton, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../utils/jwt.helper';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { postImage } from '../../components/endpoints/dashboard.endpoints';
import ReactToast from '../../components/Toast/Toast';

const ChatLayout = () => {
  const token = localStorage.getItem('token');
  useAuthCheck();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'assistant' }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSend = async () => {
    // Validation First
    if (!message.trim() || !file) {
      setToastMessage('File or message is missing.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', message);

    // Add user's message immediately
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setLoading(true);

    try {
      const response = await postImage(formData, token);
      // Example: Assuming response gives a reply text
      setMessages((prev) => [...prev, { text: response?.reply || "Assistant response", sender: 'assistant' }]);

      setMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setToastMessage('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
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
      {/* Left side - TradingView Widget */}
      <Box sx={{ flex: 3, p: 2 }}>
        <Box id="tv-script-container" sx={{ width: '100%', height: '100%' }}>
          <div id="tradingview_widget" style={{ height: '100%' }} />
        </Box>
      </Box>

      {/* Right side - Chat */}
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
        {toastMessage && <ReactToast toastMessage={toastMessage} />}

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
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {messages.length === 0 ? (
            <Typography variant="body2" color="white">
              No messages yet.
            </Typography>
          ) : (
            messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.sender === 'user' ? '#4A90E2' : '#7B7D8D',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: '80%',
                }}
              >
                <Typography>{msg.text}</Typography>
              </Box>
            ))
          )}
          {loading && (
            <Box sx={{ alignSelf: 'center', mt: 1 }}>
              <CircularProgress size={24} sx={{ color: 'white' }} />
            </Box>
          )}
        </Paper>

        {/* Input section */}
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
            name="file"
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
