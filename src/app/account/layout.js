import AccountNav from "@/components/account/AccountNav";
import RequireAuth from "@/components/auth/RequireAuth";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "My account | Shari Shop",
  robots: { index: false },
};

export default function AccountLayout({ children }) {
  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="md:grid md:grid-cols-[13rem_1fr] md:gap-8">
          <aside className="mb-4 md:mb-0">
            <AccountNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </RequireAuth>
  );
}
