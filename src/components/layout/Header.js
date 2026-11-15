import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { getCategories, getFabrics, getSettings } from "@/lib/api";
import AccountMenu from "./AccountMenu";
import AnnouncementBar from "./AnnouncementBar";
import CartLink from "./CartLink";
import HeaderShell from "./HeaderShell";
import { HeartIcon } from "./icons";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import MobileSearch from "./MobileSearch";
import SearchBar from "./SearchBar";

const ICON_LINK_CLASS =
  "flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default async function Header() {
  const [categories, fabrics, settings] = await Promise.all([
    getCategories(),
    getFabrics(),
    getSettings(),
  ]);

  return (
    <>
      <AnnouncementBar />
      <HeaderShell>
        <Container className="relative flex h-14 items-center gap-1 !px-2 sm:gap-4 md:h-16 md:!px-6 lg:!px-8">
          <MobileMenu categories={categories} fabrics={fabrics} />
          <Link
            href="/"
            className="shrink-0 rounded font-display text-xl font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-2xl"
          >
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- any host the owner pastes; small and fixed height
              <img src={settings.logoUrl} alt={settings.shopName} className="h-9 w-auto md:h-10" />
            ) : (
              <Image
                src="/ShariPori_Logo.png"
                alt={settings.shopName}
                width={1536}
                height={1024}
                sizes="96px"
                priority
                className="h-12 w-auto md:h-[3.75rem]"
              />
            )}
          </Link>
          <div className="mx-auto hidden w-full max-w-xl md:block">
            <SearchBar />
          </div>
          <div className="ml-auto flex shrink-0 items-center md:ml-0">
            <div className="md:hidden">
              <MobileSearch />
            </div>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={`${ICON_LINK_CLASS} hidden md:flex`}
            >
              <HeartIcon />
            </Link>
            <CartLink className={ICON_LINK_CLASS} />
            <div className="hidden md:block">
              <AccountMenu />
            </div>
          </div>
        </Container>
      </HeaderShell>
      <MegaMenu categories={categories} fabrics={fabrics} />
    </>
  );
}
