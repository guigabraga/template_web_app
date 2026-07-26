import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "./elements/Footer";
import Navbar from "./elements/Navbar";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          minHeight: "100dvh",
          pt: { xs: "56px", sm: "64px" },
          pb: { xs: "48px", sm: "52px" },
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
