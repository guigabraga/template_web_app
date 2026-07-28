import { useMutation } from "@tanstack/react-query";
import type { TPostAuthBody, TPostAuthResponse } from "@template-web-app/shared-types/auth";
import { authService } from "../../../services";
import { useAuthStore } from "../../../stores";

const useLoginMutation = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation<TPostAuthResponse, Error, TPostAuthBody>({
    mutationKey: ["auth", "login"],
    mutationFn: authService.post,
    onSuccess: (response) => {
      if (response.status) {
        setSession(response.data);
      }
    },
  });
};

export { useLoginMutation };
