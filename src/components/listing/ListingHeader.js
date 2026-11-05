import Breadcrumb from "@/components/ui/Breadcrumb";
import RemoteImage from "@/components/ui/RemoteImage";

export default function ListingHeader({ crumbs, title, titleBn, image }) {
  return (
    <header className="mb-6">
      <Breadcrumb crumbs={crumbs} />
      {image && (
        <div className="relative mb-4 h-32 overflow-hidden rounded-lg bg-soft md:h-48">
          <RemoteImage src={image} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <h1 className="font-display text-3xl text-primary md:text-4xl">{title}</h1>
      {titleBn && <p className="font-bangla text-text/70">{titleBn}</p>}
    </header>
  );
}
