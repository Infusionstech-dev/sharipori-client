import { siteConfig } from "@/lib/siteConfig";

const FREE_DELIVERY_TEXT = "Free delivery over ৳3000";

function announcementText() {
  if (siteConfig.announcement) {
    return siteConfig.announcement;
  }
  return siteConfig.phone
    ? `${FREE_DELIVERY_TEXT} | Hotline ${siteConfig.phone}`
    : FREE_DELIVERY_TEXT;
}

export default function AnnouncementBar() {
  return (
    <p className="h-8 truncate bg-primary px-4 text-center text-xs leading-8 text-white">
      {announcementText()}
    </p>
  );
}
