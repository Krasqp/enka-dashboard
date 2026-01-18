"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProjelerPage() {

  useEffect(() => {
    const clickSound = new Audio("/sounds/ui.mp3");
    clickSound.volume = 0.15;

    const playClick = () => {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    };

    document.addEventListener("click", playClick);

    return () => {
      document.removeEventListener("click", playClick);
    };
  }, []);

  return (

    <main className="min-h-screen bg-black text-white pt-28 px-6">
      <div className="mx-auto max-w-6xl pl-12">

        {/* BAŞLIK */}
        <h2 className="text-3xl font-light mb-1">Projeler</h2>
        <p className="text-sm text-neutral-400 mb-3">
          Aktif & Tamamlanan Şantiyeler
        </p>

        {/* 1️⃣ MİNİ ÖZET */}
        <div className="mb-10 text-xs text-neutral-500 flex gap-4">
          <span>● 1 Aktif</span>
          <span>● 0 Planlanan</span>
          <span>● 2 Tamamlanan</span>
        </div>

        {/* PROJE KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ENKA */}
          <Link
            href="/projeler/EnkaLuzhniki"
            className="group relative block rounded-2xl overflow-hidden bg-neutral-900 transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* 2️⃣ DURUM ROZETİ */}
            <span className="absolute top-4 right-4 z-10 rounded-md bg-yellow-400/90 px-2 py-0.5 text-[10px] text-black">
              Aktif
            </span>

            <img
              src="/images/enka.jpg"
              alt="Enka Luzhniki"
              className="h-64 w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />

            <div className="p-5">
              <h3 className="text-lg">Enka Luzhniki</h3>
              <p className="text-sm text-neutral-400">
                Moskova · Aktif Proje
              </p>

              {/* 3️⃣ HOVER DETAY */}
              <div className="mt-3 text-xs text-neutral-500 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <div>Son güncelleme: 18.01.2026</div>
                <div>Blok sayısı: 8</div>
              </div>
            </div>
          </Link>


{/* SYMPHONY */}
          <Link
            href="/projeler/Symphony"
            className="group relative block rounded-2xl overflow-hidden bg-neutral-900 transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* DURUM */}
            <span className="absolute top-4 right-4 z-10 rounded-md bg-green-500/90 px-2 py-0.5 text-[10px] text-black">
              Tamamlandı
            </span>

            <img
              src="/images/symphony.jpg"
              alt="Symphony-34"
              className="h-64 w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />

            <div className="p-5">
              <h3 className="text-lg">Symphony-34</h3>
              <p className="text-sm text-neutral-400">
                Moskova · Aktif Proje
              </p>

              <div className="mt-3 text-xs text-neutral-500 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <div>Son güncelleme: 18.01.2026</div>
                <div>Blok sayısı: 4</div>
              </div>
            </div>
          </Link>

          {/* SLAVA */}
          <Link
            href="/projeler/Slava"
            className="group relative block rounded-2xl overflow-hidden bg-neutral-900 transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* DURUM */}
            <span className="absolute top-4 right-4 z-10 rounded-md bg-green-500/90 px-2 py-0.5 text-[10px] text-black">
              Tamamlandı
            </span>

            <img
              src="/images/slava4.jpg"
              alt="Slava 4"
              className="h-64 w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />

            <div className="p-5">
              <h3 className="text-lg">Symphony-34</h3>
              <p className="text-sm text-neutral-400">
                Moskova · Aktif Proje
              </p>

              <div className="mt-3 text-xs text-neutral-500 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <div>Son güncelleme: 18.01.2026</div>
                <div>Blok sayısı: 3</div>
              </div>
            </div>
          </Link>
        </div>

        {/* 9️⃣ ALT KURUMSAL NOT */}
        <div className="mt-20 text-center text-xs text-neutral-600">
          Proje verileri operasyon paneli ile senkronize çalışır
        </div>

      </div>
    </main>
  );
}
