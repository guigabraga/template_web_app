import { useMutation } from "@tanstack/react-query";
import type { TPostAuthBody, TPostAuthResponse } from "@template-web-app/shared-types/auth";
import { authService } from "../../../services";

export function useLoginMutation() {
  return useMutation<TPostAuthResponse, Error, TPostAuthBody>({
    mutationKey: ["auth", "login"],
    mutationFn: authService.post,
  });
}
