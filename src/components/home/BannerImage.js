import Link from "next/link";
import clsx from "clsx";
import RemoteImage from "@/components/ui/RemoteImage";

// Banners are designed pictures, often with their own text, so they are never cropped: the image
// keeps its own shape and the banner is as tall as the image needs. width and height only reserve
// space until the image loads. A phone image, when there is one, replaces it on small screens.
export default function BannerImage({
  image,
  mobileImage,
  alt,
  href,
  priority,
  className,
  imageClassName,
}) {
  const shared = clsx("block h-auto w-full max-h-[85vh] object-contain", imageClassName);
  const picture = (
    <>
      <RemoteImage
        src={image}
        alt={alt}
        width={1600}
        height={600}
        priority={priority}
        sizes="100vw"
        className={clsx(shared, mobileImage && "hidden md:block")}
      />
      {/* display:none skips the download of the image this screen size does not use. */}
      {mobileImage && (
        <RemoteImage
          src={mobileImage}
          alt={alt}
          width={800}
          height={1000}
          priority={priority}
          sizes="100vw"
          className={clsx(shared, "md:hidden")}
        />
      )}
    </>
  );

  return href ? (
    // The button below is the link for keyboards and screen readers. This one is for taps.
    <Link href={href} tabIndex={-1} aria-hidden="true" className={clsx("block", className)}>
      {picture}
    </Link>
  ) : (
    <div className={className}>{picture}</div>
  );
}
