import { useMutation } from "@tanstack/react-query";
import type { PostAuthBody, PostAuthResponse } from "@template-web-app/shared-types/auth";
import { authService } from "../../../services";

export function useLoginMutation() {
  return useMutation<PostAuthResponse, Error, PostAuthBody>({
    mutationKey: ["auth", "login"],
    mutationFn: authService.post,
  });
}
