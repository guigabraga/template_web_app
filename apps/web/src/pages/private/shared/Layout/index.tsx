import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSidebarStore } from "../../../../stores";
import { Navbar, Sidebar } from "./elements";

const EXPANDED_SIDEBAR_WIDTH = 240;
const COLLAPSED_SIDEBAR_WIDTH = 72;

export default function Layout() {
  const isExpanded = useSidebarStore((state) => state.isExpanded);
  const sidebarWidth = isExpanded ? EXPANDED_SIDEBAR_WIDTH : COLLAPSED_SIDEBAR_WIDTH;

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Navbar />
      <Sidebar isExpanded={isExpanded} width={sidebarWidth} />

      <Box
        component="main"
        sx={(theme) => ({
          minHeight: "100dvh",
          ml: `${sidebarWidth}px`,
          pt: { xs: "56px", sm: "64px" },
          transition: theme.transitions.create("margin-left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
