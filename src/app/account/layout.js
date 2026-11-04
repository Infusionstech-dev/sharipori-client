import RequireAuth from "@/components/auth/RequireAuth";

export default function AccountLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
