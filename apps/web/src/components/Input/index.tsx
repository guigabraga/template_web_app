import { alpha, InputAdornment, TextField, type TextFieldProps } from "@mui/material";
import { useState, type ChangeEvent, type ReactNode } from "react";

export type TInputType = "text" | "number" | "email" | "password" | "phone" | "free";
export type TInputSize = "small" | "default" | "large";

type TBaseInputProps = {
  placeholder: string;
  size?: TInputSize;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, rawValue: string) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  fullWidth?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  inputRef?: TextFieldProps["inputRef"];
  onBlur?: TextFieldProps["onBlur"];
  onFocus?: TextFieldProps["onFocus"];
};

type TStandardInputProps = TBaseInputProps & {
  type?: Exclude<TInputType, "free">;
  regex?: never;
};

type TFreeInputProps = TBaseInputProps & {
  type: "free";
  regex: RegExp;
};

export type TInputProps = TStandardInputProps | TFreeInputProps;

const inputFontSizes: Record<TInputSize, string> = {
  small: "12px",
  default: "14px",
  large: "18px",
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  const areaCode = digits.slice(0, 2);
  const phoneNumber = digits.slice(2);

  if (phoneNumber.length <= 4) {
    return `(${areaCode}) ${phoneNumber}`;
  }

  const prefixLength = phoneNumber.length > 8 ? 5 : 4;
  const prefix = phoneNumber.slice(0, prefixLength);
  const suffix = phoneNumber.slice(prefixLength);

  return `(${areaCode}) ${prefix}-${suffix}`;
}

function matchesRegex(value: string, regex: RegExp) {
  regex.lastIndex = 0;
  const matches = regex.test(value);
  regex.lastIndex = 0;

  return matches;
}

function formatValue(type: TInputType, value: string) {
  return type === "phone" ? formatPhone(value) : value;
}

export default function Input({
  type = "text",
  regex,
  placeholder,
  size = "default",
  icon,
  iconPosition = "start",
  value,
  defaultValue = "",
  onChange,
  fullWidth = true,
  autoComplete,
  disabled = false,
  loading = false,
  ...props
}: TInputProps) {
  const [internalValue, setInternalValue] = useState(() => formatValue(type, defaultValue));
  const displayValue = formatValue(type, value ?? internalValue);
  const htmlType = type === "phone" ? "tel" : type === "free" ? "text" : type;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const enteredValue = event.target.value;
    const rawValue = type === "phone" ? enteredValue.replace(/\D/g, "").slice(0, 11) : enteredValue;
    const nextValue = formatValue(type, rawValue);

    if (type === "free" && regex && nextValue !== "" && !matchesRegex(nextValue, regex)) {
      return;
    }

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue, rawValue);
  };

  return (
    <TextField
      {...props}
      type={htmlType}
      value={displayValue}
      placeholder={placeholder}
      onChange={handleChange}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      autoComplete={autoComplete ?? (type === "phone" ? "tel" : undefined)}
      aria-busy={loading}
      size="small"
      variant="outlined"
      slotProps={{
        input: {
          startAdornment:
            icon && iconPosition === "start" ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
          endAdornment:
            icon && iconPosition === "end" ? <InputAdornment position="end">{icon}</InputAdornment> : undefined,
        },
        htmlInput: {
          "aria-label": placeholder,
          inputMode: type === "number" ? "decimal" : type === "phone" ? "tel" : type === "email" ? "email" : "text",
          maxLength: type === "phone" ? 15 : undefined,
          pattern: type === "free" ? regex?.source : undefined,
          step: type === "number" ? "any" : undefined,
        },
      }}
      sx={(theme) => ({
        "& .MuiOutlinedInput-root": {
          borderRadius: 999,
          fontSize: inputFontSizes[size],
          ...(loading && {
            "--input-loading-background-start": alpha(theme.palette.text.primary, 0.035),
            "--input-loading-background-end": alpha(theme.palette.text.primary, 0.075),
            animation: "inputLoadingPulse 1.5s ease-in-out infinite",
            bgcolor: "var(--input-loading-background-start)",
            "& input.Mui-disabled": {
              WebkitTextFillColor: theme.palette.text.disabled,
            },
            "& input.Mui-disabled::placeholder": {
              color: theme.palette.text.disabled,
              opacity: 1,
            },
          }),
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "0.5px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: "0.5px",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
          },
        },
        "& .MuiInputAdornment-root": {
          color: "text.secondary",
          ...(loading && {
            color: "text.disabled",
            pointerEvents: "none",
          }),
          "& .MuiSvgIcon-root": {
            fontSize: 18,
          },
        },
        "& .MuiFormHelperText-root": {
          fontSize: "11px",
        },
        "@keyframes inputLoadingPulse": {
          "0%, 100%": {
            backgroundColor: "var(--input-loading-background-start)",
          },
          "50%": {
            backgroundColor: "var(--input-loading-background-end)",
          },
        },
      })}
    />
  );
}
