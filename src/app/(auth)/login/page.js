"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { applyServerErrors, safeNextPath, serverMessage } from "@/lib/authForms";
import { useLoginMutation } from "@/store/api/authApi";
import { baseApi } from "@/store/api/baseApi";
import { setCredentials } from "@/store/slices/authSlice";

const schema = z.object({
  identifier: z.string().trim().min(1, "Enter your phone or email"),
  password: z.string().min(1, "Enter your password"),
});

function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = useSelector((state) => state.auth.status);
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "" },
  });
  const next = safeNextPath(searchParams.get("next"));

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(next);
    }
  }, [status, next, router]);

  const onSubmit = async (values) => {
    try {
      const response = await login(values).unwrap();
      // Drop anything cached by a previous account before this one's data loads.
      dispatch(baseApi.util.resetApiState());
      dispatch(setCredentials(response.data));
    } catch (err) {
      if (!applyServerErrors(err, setError)) {
        toast.error(serverMessage(err));
      }
    }
  };

  return (
    <>
      <h1 className="mb-6 font-display text-3xl text-primary">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Phone or email"
          autoComplete="username"
          error={errors.identifier?.message}
          {...register("identifier")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="text-right text-sm">
          <Link href="/forgot-password" className="text-primary underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" loading={isLoading} className="w-full">
          Login
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        New here?{" "}
        <Link href="/register" className="text-primary underline">
          Create an account
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full" />}>
      <LoginForm />
    </Suspense>
  );
}
