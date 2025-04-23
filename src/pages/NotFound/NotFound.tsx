import { Box, Typography } from "@mui/material";
import ReactToast from "../../components/Toast/Toast";



const NotFound = ({message}: {message: string}) => {
  return (
    <Box component={"div"} sx={{ width: "full", backgroundColor: "#1C192A" }}>
      <Box
        sx={{
          width: "full",
          height: "100vh",
          backgroundColor: "#1C192A",
          display: "flex",
          flexDirection: 'row',
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          gap: 0.5
        }}
      >
        <Typography sx={{ fontSize: "36px" }}>404 - Page Not Found</Typography>
        <ReactToast toastMessage={message}/>
      </Box>
    </Box>
  );
};

export default NotFound;
