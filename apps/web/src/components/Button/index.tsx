import { alpha, Button as MaterialButton, type ButtonProps as MaterialButtonProps } from "@mui/material";

import type { InputSize } from "../Input";

export type ButtonSize = InputSize;

export type ButtonProps = Omit<
  MaterialButtonProps,
  "color" | "disabled" | "fullWidth" | "loading" | "size" | "sx" | "variant"
> & {
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

const fontSizes: Record<ButtonSize, string> = {
  small: "12px",
  default: "14px",
  large: "18px",
};

export default function Button({
  size = "default",
  fullWidth = false,
  type = "button",
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <MaterialButton
      {...props}
      type={type}
      variant="contained"
      fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading}
      disableElevation
      sx={(theme) => {
        const isDarkMode = theme.palette.mode === "dark";
        const backgroundColor = isDarkMode ? "#f5f5f0" : "#000000";
        const foregroundColor = isDarkMode ? "#111111" : "#ffffff";
        const hoverBackgroundColor = isDarkMode ? "#e5e5df" : "#202020";
        const disabledBackgroundColor = isDarkMode ? "#94948f" : theme.palette.grey[800];
        const disabledForegroundColor = isDarkMode
          ? alpha(theme.palette.common.black, 0.6)
          : alpha(theme.palette.common.white, 0.7);
        const loadingStartBackgroundColor = isDarkMode ? "#858580" : disabledBackgroundColor;
        const loadingBackgroundColor = isDarkMode ? "#797974" : theme.palette.grey[700];

        return {
          minHeight: 40,
          px: 2,
          borderRadius: 999,
          bgcolor: backgroundColor,
          color: foregroundColor,
          fontSize: fontSizes[size],
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: 0,
          textTransform: "none",
          "&:hover": {
            bgcolor: hoverBackgroundColor,
          },
          "&.Mui-disabled": {
            bgcolor: disabledBackgroundColor,
            color: disabledForegroundColor,
            opacity: 1,
          },
          ...(loading && {
            "--button-loading-background-start": loadingStartBackgroundColor,
            "--button-loading-background-end": loadingBackgroundColor,
            animation: "buttonLoadingPulse 1.5s ease-in-out infinite",
            bgcolor: "var(--button-loading-background-start)",
            color: disabledForegroundColor,
            "&.Mui-disabled": {
              bgcolor: "var(--button-loading-background-start)",
              color: disabledForegroundColor,
              opacity: 1,
            },
          }),
          "@keyframes buttonLoadingPulse": {
            "0%, 100%": {
              backgroundColor: "var(--button-loading-background-start)",
            },
            "50%": {
              backgroundColor: "var(--button-loading-background-end)",
            },
          },
        };
      }}
    />
  );
}
