import { getSettings } from "@/lib/api";
import { ChatIcon } from "./icons";

const BUTTON_CLASS =
  "flex size-12 items-center justify-center rounded-full text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

// The letter tells the two chat buttons apart without copying either company's logo.
function ChatLink({ href, label, letter, className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`${BUTTON_CLASS} ${className}`}
    >
      <span className="relative flex items-center justify-center">
        <ChatIcon className="size-8" />
        <span aria-hidden="true" className="absolute text-[11px] font-bold">
          {letter}
        </span>
      </span>
    </a>
  );
}

export default async function FloatingChat() {
  const { whatsappNumber, messengerUrl } = await getSettings();
  if (!whatsappNumber && !messengerUrl) {
    return null;
  }

  return (
    <div
      data-floating-chat
      className="fixed bottom-18 right-4 z-20 flex flex-col gap-2 md:bottom-6"
    >
      {whatsappNumber && (
        <ChatLink
          href={`https://wa.me/${whatsappNumber}`}
          label="Chat on WhatsApp"
          letter="W"
          className="bg-[#128C4A]"
        />
      )}
      {messengerUrl && (
        <ChatLink
          href={messengerUrl}
          label="Chat on Messenger"
          letter="M"
          className="bg-[#0866FF]"
        />
      )}
    </div>
  );
}
