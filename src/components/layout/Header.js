import Link from "next/link";
import Container from "@/components/ui/Container";
import AccountMenu from "./AccountMenu";

export default function Header() {
  return (
    <header className="bg-primary text-white">
      <Container className="flex items-center justify-between gap-4 py-2">
        <Link href="/" className="font-display text-xl">
          Shari Shop
        </Link>
        <AccountMenu />
      </Container>
    </header>
  );
}
