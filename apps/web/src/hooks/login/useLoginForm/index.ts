import { zodResolver } from "@hookform/resolvers/zod";
import { postAuthBodySchema, type TPostAuthBody } from "@template-web-app/shared-types/auth";
import { useForm } from "react-hook-form";

const loginFormSchema = postAuthBodySchema;
type TLoginFormData = TPostAuthBody;

const useLoginForm = () => {
  return useForm<TLoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      user: "",
      pass: "",
    },
  });
};

export { loginFormSchema, useLoginForm, type TLoginFormData };
