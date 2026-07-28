import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginFormSchema = z.object({
  login: z.string().trim().min(1, "Informe o usuário ou email."),
  password: z.string().min(1, "Informe a senha."),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });
}
