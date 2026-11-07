import { getSettings } from "@/lib/api";
import { formatBDT } from "@/lib/format";

// The owner's own text when set; otherwise built from the free delivery limit and hotline.
function announcementText(settings) {
  if (settings.announcementText) {
    return settings.announcementText;
  }
  const parts = [
    settings.freeDeliveryThreshold
      ? `Free delivery over ${formatBDT(settings.freeDeliveryThreshold)}`
      : null,
    settings.phone ? `Hotline ${settings.phone}` : null,
  ].filter(Boolean);
  return parts.join(" | ");
}

export default async function AnnouncementBar() {
  const text = announcementText(await getSettings());
  if (!text) {
    return null;
  }
  return (
    <p className="h-8 truncate bg-primary px-4 text-center text-xs leading-8 text-white">{text}</p>
  );
}
