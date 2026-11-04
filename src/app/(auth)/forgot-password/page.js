"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import CodeInput from "@/components/auth/CodeInput";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { applyServerErrors, passwordRule, phoneRule, serverMessage } from "@/lib/authForms";
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/store/api/authApi";

const phoneSchema = z.object({ phone: phoneRule });

const resetSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  newPassword: passwordRule,
});

function PhoneStep({ onSent }) {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(phoneSchema), defaultValues: { phone: "" } });

  const onSubmit = async ({ phone }) => {
    try {
      const response = await forgotPassword({ phone }).unwrap();
      toast.success(response.message);
      onSent(phone);
    } catch (err) {
      toast.error(serverMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <p className="text-sm text-text/70">Enter your phone number and we will text you a code.</p>
      <Input
        label="Phone"
        type="tel"
        autoComplete="tel"
        placeholder="01XXXXXXXXX"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Button type="submit" size="lg" loading={isLoading} className="w-full">
        Send code
      </Button>
    </form>
  );
}

function ResetStep({ phone, onBack }) {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", newPassword: "" },
  });

  const onSubmit = async (values) => {
    try {
      const response = await resetPassword({ phone, ...values }).unwrap();
      toast.success(response.message);
      router.push("/login");
    } catch (err) {
      if (!applyServerErrors(err, setError)) {
        toast.error(serverMessage(err));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <p className="text-sm text-text/70">If {phone} is registered, a code is on its way.</p>
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <CodeInput value={field.value} onChange={field.onChange} error={errors.code?.message} />
        )}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters, with a letter and a number"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Button type="submit" size="lg" loading={isLoading} className="w-full">
        Reset password
      </Button>
      <Button variant="ghost" className="w-full" onClick={onBack}>
        Use a different number or send a new code
      </Button>
    </form>
  );
}

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState(null);

  return (
    <>
      <h1 className="mb-6 font-display text-3xl text-primary">Forgot password</h1>
      {phone ? (
        <ResetStep phone={phone} onBack={() => setPhone(null)} />
      ) : (
        <PhoneStep onSent={setPhone} />
      )}
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-primary underline">
          Back to login
        </Link>
      </p>
    </>
  );
}
