import CategoryCards from "@/components/home/CategoryCards";
import FabricChips from "@/components/home/FabricChips";
import HeroSlider from "@/components/home/HeroSlider";
import MatchingBanner from "@/components/home/MatchingBanner";
import PackagesSection from "@/components/home/PackagesSection";
import ProductSection from "@/components/home/ProductSection";
import TrustStrip from "@/components/home/TrustStrip";
import { apiGet, getCategories, getFabrics } from "@/lib/api";
import { categoryHref } from "@/lib/siteConfig";

export const revalidate = 300;

// TODO(T8.2): replace with the banners API. Images come from featured products until then.
const FALLBACK_BANNERS = [
  {
    title: "Traditional clothing for mother and baby",
    subtitle: "Handpicked sarees and ready shari for every celebration.",
    cta: "Shop mother's sarees",
    href: categoryHref("mothers-saree"),
  },
  {
    title: "Baby ready shari",
    subtitle: "Easy to dress, made for little ones.",
    cta: "Shop baby shari",
    href: categoryHref("baby-ready-shari"),
  },
  {
    title: "Combos that save more",
    subtitle: "Sonamoni Combo and Maharani Package sets.",
    cta: "See packages",
    href: categoryHref("combo-packages"),
  },
];

const getProducts = async (params) =>
  (await apiGet(`/products?${new URLSearchParams(params)}`, {
    revalidate,
    tags: ["products"],
  })) ?? [];

export default async function HomePage() {
  const [
    categories,
    fabrics,
    featured,
    newest,
    popular,
    sonamoni,
    maharani,
    motherProducts,
    babyProducts,
  ] = await Promise.all([
    getCategories(),
    getFabrics(),
    getProducts({ featured: true, limit: FALLBACK_BANNERS.length }),
    getProducts({ type: "single", sort: "newest", limit: 8 }),
    getProducts({ type: "single", sort: "popular", limit: 8 }),
    getProducts({ type: "bundle", category: "sonamoni-combo", sort: "popular", limit: 1 }),
    getProducts({ type: "bundle", category: "maharani-package", sort: "popular", limit: 1 }),
    getProducts({ category: "mothers-saree", type: "single", sort: "popular", limit: 1 }),
    getProducts({ category: "baby-ready-shari", type: "single", sort: "popular", limit: 1 }),
  ]);

  const slides = FALLBACK_BANNERS.map((banner, index) => ({
    ...banner,
    image: featured[index]?.image ?? null,
  }));

  return (
    <>
      <HeroSlider slides={slides} />
      <CategoryCards categories={categories} />
      <MatchingBanner motherImage={motherProducts[0]?.image} babyImage={babyProducts[0]?.image} />
      <PackagesSection
        packages={[
          { label: "Sonamoni Combo", product: sonamoni[0] },
          { label: "Maharani Package", product: maharani[0] },
        ]}
      />
      <FabricChips fabrics={fabrics} />
      <ProductSection title="New arrivals" viewAllHref="/products?sort=newest" products={newest} />
      <ProductSection
        title="Best sellers"
        viewAllHref="/products?sort=popular"
        products={popular}
        carousel
      />
      <TrustStrip />
    </>
  );
}
