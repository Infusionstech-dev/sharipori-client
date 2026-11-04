"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import { applyServerErrors, passwordRule, phoneRule, serverMessage } from "@/lib/authForms";
import { useRegisterMutation } from "@/store/api/authApi";
import { baseApi } from "@/store/api/baseApi";
import { setCredentials } from "@/store/slices/authSlice";

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(100),
    phone: phoneRule,
    email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(150)]),
    password: passwordRule,
    confirmPassword: z.string(),
    terms: z.boolean().refine(Boolean, "Please accept the terms to continue"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const status = useSelector((state) => state.auth.status);
  const [registerAccount, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/account");
    }
  }, [status, router]);

  const onSubmit = async ({ terms: _terms, ...values }) => {
    try {
      const response = await registerAccount(values).unwrap();
      dispatch(baseApi.util.resetApiState());
      dispatch(setCredentials(response.data));
      toast.success("Welcome to Shari Shop!");
    } catch (err) {
      if (!applyServerErrors(err, setError)) {
        toast.error(serverMessage(err));
      }
    }
  };

  return (
    <>
      <h1 className="mb-6 font-display text-3xl text-primary">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Email (optional)"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with a letter and a number"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <div>
          <Checkbox label="I agree to the terms and conditions" {...register("terms")} />
          {errors.terms && <p className="text-sm text-red-700">{errors.terms.message}</p>}
        </div>
        <Button type="submit" size="lg" loading={isLoading} className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">
          Login
        </Link>
      </p>
    </>
  );
}
