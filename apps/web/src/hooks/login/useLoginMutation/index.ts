import { useMutation } from "@tanstack/react-query";
import type { TPostAuthBody, TPostAuthResponse } from "@template-web-app/shared-types/auth";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services";
import { useAuthStore } from "../../../stores";

const LOGIN_SUCCESS_FEEDBACK_DELAY = 1000;

const useLoginMutation = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation<TPostAuthResponse, Error, TPostAuthBody>({
    mutationKey: ["auth", "login"],
    mutationFn: authService.post,
    onSuccess: async (response) => {
      if (response.status) {
        await new Promise((resolve) => setTimeout(resolve, LOGIN_SUCCESS_FEEDBACK_DELAY));
        navigate("/home", { replace: true });
        setSession(response.data);
      }
    },
  });
};

export { useLoginMutation };
