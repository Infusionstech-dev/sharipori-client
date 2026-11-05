"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "@/components/ui/Drawer";
import { categoryHref, fabricHref } from "@/lib/siteConfig";
import { setMobileMenuOpen } from "@/store/slices/uiSlice";
import { ChevronDownIcon, MenuIcon } from "./icons";
import useLogout from "./useLogout";

const ROW_CLASS =
  "flex min-h-11 w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

function Name({ nameEn, nameBn }) {
  return (
    <span>
      <span className="block text-sm font-medium">{nameEn}</span>
      {nameBn && <span className="block font-bangla text-xs text-text/70">{nameBn}</span>}
    </span>
  );
}

function Accordion({ summary, children }) {
  return (
    <details className="group">
      <summary className={`${ROW_CLASS} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
        {summary}
        <ChevronDownIcon className="size-5 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="ml-2 border-l border-soft pl-2">{children}</div>
    </details>
  );
}

export default function MobileMenu({ categories, fabrics }) {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.mobileMenuOpen);
  const status = useSelector((state) => state.auth.status);
  const logout = useLogout();

  const close = () => dispatch(setMobileMenuOpen(false));

  const navLink = (href, content) => (
    <Link key={href} href={href} onClick={close} className={ROW_CLASS}>
      {content}
    </Link>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => dispatch(setMobileMenuOpen(true))}
        className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
      >
        <MenuIcon />
      </button>

      <Drawer side="left" open={open} onClose={close} title="Menu">
        <nav aria-label="Mobile menu" className="space-y-6">
          <section>
            <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-text/70">Categories</h3>
            {categories.map((category) =>
              category.children.length ? (
                <Accordion
                  key={category.id}
                  summary={<Name nameEn={category.nameEn} nameBn={category.nameBn} />}
                >
                  {category.children.map((child) =>
                    navLink(
                      categoryHref(child.slug),
                      <Name nameEn={child.nameEn} nameBn={child.nameBn} />
                    )
                  )}
                  {navLink(
                    categoryHref(category.slug),
                    <span className="text-sm font-medium text-primary">Shop all</span>
                  )}
                </Accordion>
              ) : (
                navLink(
                  categoryHref(category.slug),
                  <Name nameEn={category.nameEn} nameBn={category.nameBn} />
                )
              )
            )}
          </section>

          {fabrics.length > 0 && (
            <section>
              <Accordion
                summary={
                  <span className="text-xs font-semibold uppercase text-text/70">
                    Shop by fabric
                  </span>
                }
              >
                {fabrics.map((fabric) =>
                  navLink(
                    fabricHref(fabric.slug),
                    <Name nameEn={fabric.nameEn} nameBn={fabric.nameBn} />
                  )
                )}
              </Accordion>
            </section>
          )}

          <section className="border-t border-soft pt-4">
            <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-text/70">Account</h3>
            {navLink("/wishlist", <span className="text-sm font-medium">Wishlist</span>)}
            {status === "authenticated" ? (
              <>
                {navLink("/account", <span className="text-sm font-medium">My account</span>)}
                {navLink("/account/orders", <span className="text-sm font-medium">Orders</span>)}
                <button
                  type="button"
                  className={ROW_CLASS}
                  onClick={() => {
                    close();
                    logout();
                  }}
                >
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                {navLink("/login", <span className="text-sm font-medium">Login</span>)}
                {navLink("/register", <span className="text-sm font-medium">Create account</span>)}
              </>
            )}
          </section>
        </nav>
      </Drawer>
    </>
  );
}
