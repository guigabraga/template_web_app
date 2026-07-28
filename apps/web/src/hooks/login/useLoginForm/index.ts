import { zodResolver } from "@hookform/resolvers/zod";
import { postAuthBodySchema, type PostAuthBody } from "@template-web-app/shared-types/auth";
import { useForm } from "react-hook-form";

export const loginFormSchema = postAuthBodySchema;
export type LoginFormData = PostAuthBody;

export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      user: "",
      pass: "",
    },
  });
}
