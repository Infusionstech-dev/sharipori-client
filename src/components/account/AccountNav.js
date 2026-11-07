"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import useLogout from "@/components/layout/useLogout";

const LINKS = [
  { href: "/account", label: "Profile", Icon: User, exact: true },
  { href: "/account/orders", label: "Orders", Icon: Package },
  { href: "/account/addresses", label: "Addresses", Icon: MapPin },
  { href: "/wishlist", label: "Wishlist", Icon: Heart },
];

const ITEM_CLASS =
  "flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

// Top tabs that scroll sideways on phones, a sidebar from md up.
export default function AccountNav() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <nav aria-label="My account">
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-col md:px-0">
        {LINKS.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  ITEM_CLASS,
                  active
                    ? "bg-primary text-white"
                    : "bg-white ring-1 ring-soft hover:bg-soft md:ring-0"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={logout}
            className={clsx(ITEM_CLASS, "w-full bg-white ring-1 ring-soft hover:bg-soft md:ring-0")}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
