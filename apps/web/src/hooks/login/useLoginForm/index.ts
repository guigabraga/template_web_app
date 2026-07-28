import { zodResolver } from "@hookform/resolvers/zod";
import { postAuthBodySchema, type TPostAuthBody } from "@template-web-app/shared-types/auth";
import { useForm } from "react-hook-form";

export const loginFormSchema = postAuthBodySchema;
export type TLoginFormData = TPostAuthBody;

export function useLoginForm() {
  return useForm<TLoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      user: "",
      pass: "",
    },
  });
}
