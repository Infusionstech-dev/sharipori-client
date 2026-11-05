"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ARROW_CLASS =
  "absolute top-1/3 z-20 hidden size-11 items-center justify-center rounded-full bg-white text-primary shadow-md hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:hidden md:flex";

export default function ProductCarousel({ label, children }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <div role="group" aria-label={label} className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <ul className="-ml-4 flex">{children}</ul>
      </div>
      <button
        type="button"
        aria-label="Previous products"
        disabled={!canPrev}
        onClick={() => emblaApi?.scrollPrev()}
        className={`${ARROW_CLASS} left-2`}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="More products"
        disabled={!canNext}
        onClick={() => emblaApi?.scrollNext()}
        className={`${ARROW_CLASS} right-2`}
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}
