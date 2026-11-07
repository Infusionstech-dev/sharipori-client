"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { applyServerErrors, passwordRule, serverMessage } from "@/lib/authForms";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/accountApi";
import { useChangePasswordMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { LoadError, PageTitle } from "./States";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(150)]),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords do not match",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "Choose a password you are not using now",
  });

const CARD_CLASS = "space-y-4 rounded-lg bg-white p-4 ring-1 ring-soft md:p-6";

function ProfileForm({ profile }) {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name, email: profile.email ?? "" },
  });

  const onSubmit = async (values) => {
    try {
      const saved = await updateProfile(values).unwrap();
      // The header and checkout read the name from the session, so it changes there too.
      dispatch(setCredentials({ accessToken, user: saved }));
      reset({ name: saved.name, email: saved.email ?? "" });
      toast.success("Profile saved");
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        toast.error(serverMessage(error, "Could not save your profile."));
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={CARD_CLASS}>
      <h2 className="font-semibold">Profile</h2>
      <Input
        label="Full name"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Phone"
        value={profile.phone}
        readOnly
        disabled
        hint="Your phone number is your login, so it cannot be changed here."
      />
      <Input
        label="Email (optional)"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button type="submit" loading={isLoading} disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      reset();
      toast.success("Password changed. You have been logged out on your other devices.");
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        toast.error(serverMessage(error, "Could not change your password."));
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={CARD_CLASS}>
      <h2 className="font-semibold">Change password</h2>
      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" loading={isLoading}>
        Change password
      </Button>
    </form>
  );
}

export default function ProfileView() {
  const { data, isLoading, isError, refetch } = useGetProfileQuery();

  useEffect(() => {
    document.title = "Profile | Shari Shop";
  }, []);

  return (
    <div>
      <PageTitle>My account</PageTitle>
      {isLoading && <Skeleton className="h-72" />}
      {isError && <LoadError what="profile" onRetry={refetch} />}
      {data && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ProfileForm profile={data} />
          <PasswordForm />
        </div>
      )}
    </div>
  );
}
