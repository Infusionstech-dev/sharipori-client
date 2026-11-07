import { cache } from "react";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Container from "@/components/ui/Container";
import { apiGetResponse, getSettings } from "@/lib/api";

export const revalidate = 600;

const HTML_CLASS =
  "leading-relaxed [&_a]:text-primary [&_a]:underline [&_h1]:mb-3 [&_h1]:font-display [&_h1]:text-2xl [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-primary [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold [&_img]:my-4 [&_img]:rounded-lg [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_table]:mb-4 [&_td]:border [&_td]:border-soft [&_td]:p-2 [&_th]:border [&_th]:border-soft [&_th]:p-2 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6";

const getPage = cache(async (slug) => {
  const response = await apiGetResponse(`/pages/${encodeURIComponent(slug)}`, {
    revalidate,
    tags: ["pages"],
  });
  if (response?.status === 400 || response?.status === 404) {
    notFound();
  }
  if (!response?.data) {
    throw new Error("Could not load the page");
  }
  return response.data;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  const title = `${page.title} | ${settings.shopName}`;
  const description = page.metaDescription || `${page.title} at ${settings.shopName}.`;
  return {
    title,
    description,
    alternates: { canonical: `/pages/${slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ContentPage({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);

  return (
    <Container className="max-w-3xl py-8">
      <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <h1 className="mb-6 font-display text-3xl text-primary md:text-4xl">{page.title}</h1>
      {/* The API cleans this HTML when it is saved. */}
      <article
        className={HTML_CLASS}
        dangerouslySetInnerHTML={{ __html: page.contentHtml ?? "" }}
      />
    </Container>
  );
}
