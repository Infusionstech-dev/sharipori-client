"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";
import { Pause, Play } from "lucide-react";
import RemoteImage from "@/components/ui/RemoteImage";

const AUTOPLAY_MS = 5000;

export default function HeroSlider({ slides }) {
  // Swiping must not silently stop the slides: only the pause button does that.
  const [autoplay] = useState(() =>
    Autoplay({ delay: AUTOPLAY_MS, playOnInit: false, stopOnInteraction: false })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Slides stay still for people who ask their device to reduce motion.
  useEffect(() => {
    if (!emblaApi || slides.length < 2) {
      return;
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.play();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the browser setting is only readable here
      setPlaying(true);
    }
  }, [autoplay, emblaApi, slides.length]);

  const togglePlaying = useCallback(() => {
    if (playing) {
      autoplay.stop();
    } else {
      autoplay.play();
    }
    setPlaying(!playing);
  }, [autoplay, playing]);

  return (
    <section aria-roledescription="carousel" aria-label="Highlights" className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              className="grid h-96 min-w-0 flex-[0_0_100%] grid-cols-[3fr_2fr] bg-primary text-white md:h-[28rem] md:grid-cols-2"
            >
              <div className="flex flex-col items-start justify-center gap-3 px-4 sm:px-8 lg:px-16">
                <h2 className="font-display text-2xl md:text-5xl">{slide.title}</h2>
                <p className="text-sm text-white/90 md:text-lg">{slide.subtitle}</p>
                <Link
                  href={slide.href}
                  className="mt-2 flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-text hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {slide.cta}
                </Link>
              </div>
              <div className="relative bg-white/10">
                {slide.image && (
                  <RemoteImage
                    src={slide.image}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 768px) 50vw, 40vw"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-2 left-4 flex items-center sm:left-8 lg:left-16">
          <button
            type="button"
            aria-label={playing ? "Pause slides" : "Play slides"}
            onClick={togglePlaying}
            className="flex size-11 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {playing ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
          </button>
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => emblaApi?.scrollTo(index)}
              className="flex size-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span
                className={clsx("size-2.5 rounded-full", index === selected ? "bg-accent" : "bg-white/50")}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
