"use client";

import { useState } from "react";

const projects = [
  {
    name: "Enka Luzhniki",
    images: [
      "/images/enka/1.jpg",
      "/images/enka/2.jpg",
      "/images/enka/3.jpg",
      "/images/enka/4.jpg",
    ],
  },
  {
    name: "Slava 4",
    images: [],
  },
  {
    name: "Symphony-34",
    images: [
      "/images/symphony34/1.jpg",
      "/images/symphony34/2.jpg",
    ],
  },
];

export default function ProjectSlider() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  // sadece resmi olanlar
  const items = projects
    .filter(p => p.images.length > 0)
    .flatMap(p =>
      p.images.map(img => ({
        img,
        name: p.name,
      }))
    );

  return (
    <>
      {/* ===== SLIDER ===== */}
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-6">
          {[...items, ...items].map((item, i) => (
            <div
              key={i}
              className="group relative h-[460px] w-[320px] md:w-[380px] shrink-0 rounded-2xl overflow-hidden bg-neutral-900"
            >
              {/* IMAGE */}
              <img
                src={item.img}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                onClick={() => setLightbox(item.img)}
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition pointer-events-none" />

              {/* TITLE */}
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-sm tracking-wide text-white">
                  {item.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {lightbox && (
  <div
    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
    onClick={() => setLightbox(null)}
  >
    <img
      src={lightbox}
      className="max-h-[90vh] max-w-[90vw] rounded-xl animate-zoomIn cursor-zoom-out"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}



      {/* ===== ANIMATION ===== */}
      <style jsx global>{`

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-zoomIn {
  animation: zoomIn 0.35s ease-out forwards;
}

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 70s linear infinite;
          will-change: transform;
        }
      `}</style>
    </>
  );
}
