import { useMutation } from "@tanstack/react-query";

import type { LoginFormData } from "../useLoginForm";

const LOGIN_DELAY = 2000;

async function simulateLogin(credentials: LoginFormData) {
  await new Promise((resolve) => setTimeout(resolve, LOGIN_DELAY));

  return {
    login: credentials.login,
  };
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: simulateLogin,
  });
}
