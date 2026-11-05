"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";
import RemoteImage from "@/components/ui/RemoteImage";

const ZOOM = 2;

// Swiping is for touch. With a mouse, moving over the image zooms instead.
const touchDragOnly = (_api, event) => event.type !== "mousedown";

function Slides({ images, name }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ watchDrag: touchDragOnly });
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const onPointerMove = (event) => {
    if (event.pointerType !== "mouse") {
      return;
    }
    const box = event.currentTarget.getBoundingClientRect();
    setZoom(
      `${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`
    );
  };

  return (
    <div className="min-w-0">
      {/* pinch-zoom leaves pinching to the browser, while sideways swipes go to the carousel. */}
      <div
        ref={emblaRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setZoom(null)}
        className="touch-[pan-y_pinch-zoom] overflow-hidden rounded-lg bg-soft"
      >
        <div className="flex">
          {images.map((image, index) => (
            <div key={image.id} className="relative aspect-[3/4] min-w-0 flex-[0_0_100%]">
              <RemoteImage
                src={image.url}
                alt={`${name}, image ${index + 1} of ${images.length}`}
                fill
                priority={index === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                style={
                  zoom && index === selected
                    ? { transform: `scale(${ZOOM})`, transformOrigin: zoom }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={index === selected}
                onClick={() => emblaApi?.scrollTo(index)}
                className={clsx(
                  "relative block h-20 w-16 overflow-hidden rounded bg-soft ring-2 focus-visible:outline-none focus-visible:ring-primary",
                  index === selected ? "ring-primary" : "ring-transparent"
                )}
              >
                <RemoteImage src={image.url} fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Gallery({ images, colorId, name }) {
  const forColor = images.filter((image) => colorId !== null && image.colorId === colorId);
  const shown = forColor.length ? forColor : images;

  if (!shown.length) {
    return <div className="aspect-[3/4] rounded-lg bg-soft" />;
  }
  // The key restarts at the first image whenever the set of images changes.
  return <Slides key={shown.map((image) => image.id).join()} images={shown} name={name} />;
}
