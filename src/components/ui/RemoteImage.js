import Image from "next/image";

const OPTIMIZED_HOSTS = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const canOptimize = (src) => {
  try {
    const { protocol, hostname } = new URL(src);
    return protocol === "https:" && OPTIMIZED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
};

// Staff can paste an image link from any site, and next/image throws on an unlisted host.
// Listed hosts get resized; anything else is shown as it is.
export default function RemoteImage({ src, alt = "", ...props }) {
  return <Image src={src} alt={alt} unoptimized={!canOptimize(src)} {...props} />;
}
