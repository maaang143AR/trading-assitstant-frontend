import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/jwt.helper";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { postImage } from "../../components/endpoints/dashboard.endpoints";
import ReactToast from "../../components/Toast/Toast";

const ChatLayout = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("token");
  useAuthCheck();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "assistant" }[]
  >([]);
  const [file, setFile] = useState<File | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSend = async () => {
    // Validation First
    if (!message.trim() || !file) {
      setToastMessage("File or message is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);

    // Add user's message immediately
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    setLoading(true);

    try {
      const response = await postImage(formData, token);
      // Example: Assuming response gives a reply text
      setMessages((prev) => [
        ...prev,
        { text: response?.reply || "Assistant response", sender: "assistant" },
      ]);

      setMessage("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setToastMessage("Failed to send. Please try again.");
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
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        width: "100%",
        height: "100%",
        symbol: "NASDAQ:AAPL",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_widget",
      });
    };

    const newsScript = document.createElement("script");
    newsScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.async = true;
    newsScript.innerHTML = JSON.stringify({
      feedMode: "market",
      market: "crypto", // ← pulls headlines tagged as crypto
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: 400,
      locale: "en",
    });
    document.getElementById("tv-news-widget")?.appendChild(newsScript);

    const container = document.getElementById("tv-script-container");
    if (container) {
      container.appendChild(script);
    }
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#1C192A" }}>
      {/* Left side - TradingView Widget */}
      <Box sx={{ flex: 2.7, p: 2 }}>
        <Box
          id="tv-script-container"
          sx={{ width: "100%", height: "100%", overflowY: "scroll" }}
        >
          {/* tradingview widget container */}
          <div id="tradingview_widget" style={{ height: "100%" }} />

          {/* news container start*/}
          <Box>
            <Typography variant="h6" color="white" sx={{ mt: 1,mb: 1 }}>
              News and Updates
            </Typography>
            <div id="tv-news-widget" />
          </Box>
          {/* news container end */}
        </Box>
      </Box>

      {/* Right side - Chat */}
      <Box
        sx={{
          flex: 1.3,
          bgcolor: "#1C192A",
          color: "white",
          borderLeft: "1px solid #333",
          p: 2,
          display: "flex",
          flexDirection: "column",
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
            overflowY: "auto",
            bgcolor: "#2C2A3A",
            color: "white",
            display: "flex",
            flexDirection: "column",
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
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  bgcolor: msg.sender === "user" ? "#4A90E2" : "#1C192A",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: "80%",
                }}
              >
                <Typography>{msg.text}</Typography>
              </Box>
            ))
          )}
          {loading && (
            <Box sx={{ alignSelf: "center", mt: 1 }}>
              <CircularProgress size={24} sx={{ color: "white" }} />
            </Box>
          )}
        </Paper>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Image Preview Thumbnail Inline */}
          {file && (
            <Box
              sx={{
                position: "relative",
                width: 50,
                height: 50,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #555",
                flexShrink: 0,
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={() => setFile(null)}
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -2,
                  width: 24,
                  height: 24,
                  padding: 0,
                  color: "#000",
                  fontSize: "16px",
                  borderRadius: "50%",
                  "&:hover": {
                    bgcolor: "grey",
                    color: "white", // optional: background color on hover
                  },
                }}
              >
                ×
              </IconButton>
            </Box>
          )}

          {/* Text Input */}
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="Type your message..."
            InputProps={{
              sx: {
                color: "white",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "white",
              },
            }}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            name="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
            accept="image/*"
          />
          <IconButton
            component="label"
            htmlFor="file-upload"
            sx={{ color: "white" }}
          >
            <AttachFileIcon />
          </IconButton>

          {/* Send Button */}
          <IconButton onClick={handleSend} sx={{ color: "white" }}>
            <SendIcon />
          </IconButton>
        </Box>

        {/* input section end*/}
      </Box>
    </Box>
  );
};

export default ChatLayout;
