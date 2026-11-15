import CategoryCards from "@/components/home/CategoryCards";
import FabricChips from "@/components/home/FabricChips";
import HeroSlider from "@/components/home/HeroSlider";
import MatchingBanner from "@/components/home/MatchingBanner";
import PromoBanner from "@/components/home/PromoBanner";
import PackagesSection from "@/components/home/PackagesSection";
import ProductSection from "@/components/home/ProductSection";
import TrustStrip from "@/components/home/TrustStrip";
import { apiGet, getBanners, getCategories, getFabrics } from "@/lib/api";

export const revalidate = 300;

const getProducts = async (params) =>
  (await apiGet(`/products?${new URLSearchParams(params)}`, {
    revalidate,
    tags: ["products"],
  })) ?? [];

export default async function HomePage() {
  const [
    categories,
    fabrics,
    newest,
    popular,
    sonamoni,
    maharani,
    motherProducts,
    babyProducts,
    heroBanners,
    middleBanners,
  ] = await Promise.all([
    getCategories(),
    getFabrics(),
    getProducts({ type: "single", sort: "newest", limit: 8 }),
    getProducts({ type: "single", sort: "popular", limit: 8 }),
    getProducts({ type: "bundle", category: "sonamoni-combo", sort: "popular", limit: 1 }),
    getProducts({ type: "bundle", category: "maharani-package", sort: "popular", limit: 1 }),
    getProducts({ category: "mothers-saree", type: "single", sort: "popular", limit: 1 }),
    getProducts({ category: "baby-ready-shari", type: "single", sort: "popular", limit: 1 }),
    getBanners("home_hero"),
    getBanners("home_middle"),
  ]);

  const slides = heroBanners.map((banner) => ({
    key: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    cta: banner.buttonText,
    href: banner.link,
    image: banner.imageUrl,
    mobileImage: banner.mobileImageUrl,
  }));

  return (
    <>
      {slides.length > 0 && <HeroSlider slides={slides} />}
      <CategoryCards categories={categories} />
      {middleBanners.length ? (
        <PromoBanner banner={middleBanners[0]} />
      ) : (
        <MatchingBanner motherImage={motherProducts[0]?.image} babyImage={babyProducts[0]?.image} />
      )}
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
