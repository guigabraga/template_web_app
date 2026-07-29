import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { AppBar, Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import { ButtonTheme } from "../../../../../../shared";
import { useSidebarStore } from "../../../../../../stores";
import { UserMenu } from "./elements";

export default function Navbar() {
  const isExpanded = useSidebarStore((state) => state.isExpanded);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const toggleLabel = isExpanded ? "Recolher menu lateral" : "Expandir menu lateral";

  return (
    <AppBar
      component="header"
      position="fixed"
      color="inherit"
      elevation={0}
      sx={(theme) => ({
        right: 0,
        left: 0,
        width: "100%",
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar disableGutters>
        <Box sx={{ width: 72, display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <Tooltip title={toggleLabel} placement="right">
            <IconButton
              aria-label={toggleLabel}
              onClick={toggleSidebar}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 22,
                },
              }}
            >
              {isExpanded ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexShrink: 0,
            gap: 0.5,
            ml: "auto",
            mr: { xs: 1.5, sm: 2 },
          }}
        >
          <ButtonTheme />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
