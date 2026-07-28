import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Box, IconButton } from "@mui/material";
import { useState, type MouseEvent } from "react";
import { Controller } from "react-hook-form";
import { Button, Input } from "../../../../components";
import { type LoginFormData, useLoginForm, useLoginMutation } from "../../../../hooks/login";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useLoginForm();
  const loginMutation = useLoginMutation();
  const isLoading = isSubmitting || loginMutation.isPending;

  const handlePasswordVisibility = () => {
    setShowPassword((isVisible) => !isVisible);
  };

  const handlePasswordMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = (data: LoginFormData) => loginMutation.mutate(data);

  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(handleLogin)}
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          px: 2,
        }}
      >
        <Controller
          name="user"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              type="text"
              placeholder="Usuário ou Email"
              autoComplete="username"
              autoFocus
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              loading={isLoading}
              required
              size="large"
            />
          )}
        />

        <Controller
          name="pass"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              autoComplete="current-password"
              iconPosition="end"
              size="large"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              loading={isLoading}
              icon={
                <IconButton
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  edge="end"
                  size="small"
                  onClick={handlePasswordVisibility}
                  onMouseDown={handlePasswordMouseDown}
                >
                  {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                </IconButton>
              }
              required
            />
          )}
        />

        <Button type="submit" size="large" fullWidth disabled={!isValid} loading={isLoading}>
          Acessar
        </Button>
      </Box>
    </Box>
  );
}
