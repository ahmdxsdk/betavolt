'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { HeroMedia } from '@/app/api/admin/content/home/media/route';

/* Auto-advance interval for image slideshow (ms) */
const SLIDE_INTERVAL = 4000;

interface Props {
  media: HeroMedia | null;
}

export default function HeroMediaDisplay({ media }: Props) {

  /* ── Slideshow state (only relevant when type=images, items>1) ── */
  const isSlideshow = media?.type === 'images' && (media?.items.length ?? 0) > 1;
  const [active, setActive]   = useState(0);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    if (!isSlideshow) return;
    const total = media!.items.length;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive(prev => (prev + 1) % total);
        setFading(false);
      }, 400); // cross-fade half-duration
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [isSlideshow, media]);

  /* ── Fallback: no media configured → default site video ── */
  if (!media || media.items.length === 0) {
    return (
      <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10] w-full bg-slate-900 dark:bg-slate-950">
        <video
          autoPlay loop muted playsInline
          poster="/img/video-placeholder.jpg"
          aria-hidden="true"
          className="w-full h-full object-cover"
        >
          <source src="/img/betavolt.webm" type="video/webm" />
          <source src="/img/betavolt.mp4"  type="video/mp4"  />
        </video>
      </div>
    );
  }

  /* ── Single video ── */
  if (media.type === 'video') {
    return (
      <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10] w-full bg-slate-900 dark:bg-slate-950">
        <video
          autoPlay loop muted playsInline
          aria-hidden="true"
          className="w-full h-full object-cover"
        >
          <source src={media.items[0]} />
        </video>
      </div>
    );
  }

  /* ── Single image ── */
  if (media.items.length === 1) {
    return (
      <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10] w-full relative bg-slate-900 dark:bg-slate-950">
        <Image
          src={media.items[0]}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
          unoptimized
        />
      </div>
    );
  }

  /* ── Multi-image slideshow ── */
  return (
    <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10] w-full relative bg-slate-900 dark:bg-slate-950 overflow-hidden">
      {media.items.map((url, idx) => (
        <Image
          key={url}
          src={url}
          alt=""
          fill
          className={[
            'object-cover transition-opacity duration-700 ease-in-out',
            idx === active
              ? fading ? 'opacity-0' : 'opacity-100'
              : 'opacity-0',
          ].join(' ')}
          sizes="(max-width:1024px) 100vw, 50vw"
          priority={idx === 0}
          unoptimized
        />
      ))}

      {/* Dots indicator */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
        {media.items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => { setFading(false); setActive(idx); }}
            className={[
              'rounded-full transition-all duration-300',
              idx === active
                ? 'w-5 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
