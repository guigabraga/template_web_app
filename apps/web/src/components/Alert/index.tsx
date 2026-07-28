import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Alert as MaterialAlert, Fade, IconButton, alpha, type AlertProps as MaterialAlertProps } from "@mui/material";
import { useState, type ReactNode } from "react";

type TAlertType = "success" | "alert" | "error";

type TAlertProps = Omit<MaterialAlertProps, "action" | "color" | "icon" | "onClose" | "severity" | "sx" | "variant"> & {
  type: TAlertType;
  open?: boolean;
  onClose?: () => void;
};

const icons: Record<TAlertType, ReactNode> = {
  success: <CheckCircleRoundedIcon />,
  alert: <WarningRoundedIcon />,
  error: <ErrorRoundedIcon />,
};

const Alert = ({ type, open, onClose, children, ...props }: TAlertProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const isVisible = open ?? isOpen;

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Fade in={isVisible} timeout={250} mountOnEnter unmountOnExit>
      <MaterialAlert
        {...props}
        icon={icons[type]}
        action={
          <IconButton aria-label="Fechar aviso" color="inherit" size="small" onClick={handleClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        }
        role={type === "error" ? "alert" : "status"}
        sx={(theme) => {
          const isDarkMode = theme.palette.mode === "dark";
          const colors = {
            success: {
              border: isDarkMode ? "#42a5f5" : "#1565c0",
              background: isDarkMode ? alpha("#90caf9", 0.12) : alpha("#1976d2", 0.1),
              foreground: isDarkMode ? "#bbdefb" : "#0d47a1",
            },
            alert: {
              border: isDarkMode ? "#ffa726" : "#ef6c00",
              background: isDarkMode ? alpha("#ffb74d", 0.12) : alpha("#ed6c02", 0.1),
              foreground: isDarkMode ? "#ffe0b2" : "#bf360c",
            },
            error: {
              border: isDarkMode ? "#ef5350" : "#c62828",
              background: isDarkMode ? alpha("#ef9a9a", 0.12) : alpha("#d32f2f", 0.1),
              foreground: isDarkMode ? "#ffcdd2" : "#b71c1c",
            },
          }[type];

          return {
            width: "100%",
            boxSizing: "border-box",
            alignItems: "center",
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            bgcolor: colors.background,
            color: colors.foreground,
            px: 1.5,
            py: 1,
            fontSize: "14px",
            lineHeight: 1.5,
            letterSpacing: 0,
            "& .MuiAlert-icon": {
              alignItems: "center",
              color: colors.border,
              mr: 1.25,
              py: 0,
              "& .MuiSvgIcon-root": {
                fontSize: 22,
              },
            },
            "& .MuiAlert-message": {
              flex: 1,
              minWidth: 0,
              py: 0,
              overflowWrap: "anywhere",
            },
            "& .MuiAlert-action": {
              alignItems: "center",
              color: colors.foreground,
              flexShrink: 0,
              mr: -0.5,
              ml: 1,
              p: 0,
            },
          };
        }}
      >
        {children}
      </MaterialAlert>
    </Fade>
  );
};

export { Alert, type TAlertProps, type TAlertType };
