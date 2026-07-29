import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { Router } from "../../../../../../routes/Router";

type TSidebarProps = {
  isExpanded: boolean;
  width: number;
};

const SIDEBAR_ITEM_SIZE = 44;

export default function Sidebar({ isExpanded, width }: TSidebarProps) {
  const { pathname } = useLocation();

  return (
    <Drawer
      component="aside"
      variant="permanent"
      sx={(theme) => ({
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          top: { xs: 56, sm: 64 },
          width,
          height: { xs: "calc(100dvh - 56px)", sm: "calc(100dvh - 64px)" },
          boxSizing: "border-box",
          overflowX: "hidden",
          borderRight: 0,
          bgcolor: "background.default",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
        },
      })}
    >
      <List component="nav" aria-label="Navegação principal" sx={{ px: 1, py: 1.5 }}>
        {Router.private
          .filter((route) => route.available)
          .map((route) => {
            const isActive = pathname === route.path || pathname.startsWith(`${route.path}/`);
            const title = route.title ?? route.path;

            return (
              <Tooltip key={route.path} title={isExpanded ? "" : title} placement="right">
                <ListItemButton
                  component={NavLink}
                  to={route.path}
                  selected={isActive}
                  aria-label={title}
                  sx={(theme) => {
                    const activeBackground = theme.palette.mode === "dark" ? "#f5f5f0" : "#000000";
                    const activeForeground = theme.palette.mode === "dark" ? "#111111" : "#ffffff";
                    const activeHoverBackground = theme.palette.mode === "dark" ? "#e5e5df" : "#202020";

                    return {
                      width: isExpanded ? "auto" : SIDEBAR_ITEM_SIZE,
                      height: SIDEBAR_ITEM_SIZE,
                      minHeight: SIDEBAR_ITEM_SIZE,
                      mx: isExpanded ? 0 : "auto",
                      justifyContent: isExpanded ? "initial" : "center",
                      borderRadius: 1,
                      px: isExpanded ? 1.5 : 0,
                      py: 0,
                      color: isActive ? activeForeground : "text.primary",
                      "&.Mui-selected": {
                        bgcolor: activeBackground,
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: activeHoverBackground,
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 22,
                      },
                    };
                  }}
                >
                  <ListItemIcon
                    sx={{
                      width: 32,
                      minWidth: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: isExpanded ? 1.5 : 0,
                      color: "inherit",
                    }}
                  >
                    {isActive ? route.activeIcon : route.icon}
                  </ListItemIcon>

                  {isExpanded && <ListItemText primary={title} slotProps={{ primary: { noWrap: true } }} />}
                </ListItemButton>
              </Tooltip>
            );
          })}
      </List>
    </Drawer>
  );
}
