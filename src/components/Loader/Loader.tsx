import { Box } from "@mui/material";
import "./Loader.css";
const Loading = () => {
  return (
    <Box
      height="100vh"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      bgcolor={"#1C192A"}
    >
      <div className="loader"></div>
    </Box>
  );
};

export default Loading;