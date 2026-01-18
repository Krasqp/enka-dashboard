"use client";

import { useEffect, useState } from "react";
import ProjectSlider from "../app/components/ProjectSlider";




export default function Home() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch("/api/weather")
      .then(res => res.json())
      .then(setWeather)
      .catch(() => setWeather(null));
  }, []);

useEffect(() => {
  const audio = new Audio("/sounds/ui.mp3");
  audio.volume = 0.1;

  const playClick = () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  document.addEventListener("click", playClick);

  return () => {
    document.removeEventListener("click", playClick);
  };
}, []);


  return (
    <main className="pt-16 overflow-hidden">

      {/* HERO */}
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden">


        {/* 🔹 ARKA PLAN (ZOOM IN / OUT LOOP) */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-heroZoom"
          style={{
            backgroundImage: "url(/images/arkaplan.jpg)",
          }}
        />

        {/* KARARTMA */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />



        {/* ORTA BAŞLIK – FADE IN */}
        <div className="relative z-10 text-center animate-fadeIn">
          <div className="relative z-10 text-center space-y-4">
  <h1 className="overflow-hidden text-5xl md:text-6xl font-light tracking-wide">
    <span className="inline-block animate-fadeUp delay-0">FASAD</span>{" "}
    <span className="inline-block animate-fadeUp delay-150">STROY</span>
  </h1>

  <p className="text-xs uppercase tracking-[0.35em] text-neutral-300">
    <span className="inline-block animate-fadeUp delay-300">Operasyon</span>{" "}
    <span className="inline-block animate-fadeUp delay-450">&</span>{" "}
    <span className="inline-block animate-fadeUp delay-600">Saha</span>{" "}
    <span className="inline-block animate-fadeUp delay-750">Yönetim</span>{" "}
    <span className="inline-block animate-fadeUp delay-900">Paneli</span>
  </p>
</div>
        </div>
      </section>

{/* FEATURED PROJECTS */}
<section className="mt-32 px-6">
  <div className="mx-auto max-w-7xl">
    <div className="mb-10 text-center animate-fadeIn">
  <h2 className="text-3xl md:text-4xl font-light tracking-wide">
    Şantiye Görüntüleri
  </h2>
  <p className="mt-2 text-sm text-neutral-400">
    Sahadan güncel fotoğraflar · Otomatik akış
  </p>
</div>


    <ProjectSlider />
  </div>
</section>



      {/* FOOTER */}
      <footer className="mt-32 border-t border-neutral-800 bg-black px-6 py-14 text-sm text-neutral-400">
  <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">

    {/* SOL – KURUM */}
    <div>
      <h4 className="mb-3 text-white tracking-wide">FASAD STROY</h4>
      <p className="text-neutral-500">
        Operasyon & Saha Yönetim Paneli
      </p>
      <p className="mt-3 text-xs text-neutral-600">
        Veriler Google Sheets üzerinden<br />
        anlık olarak senkronize edilir.
      </p>
    </div>

    {/* ORTA – İLETİŞİM */}
    <div>
      <h4 className="mb-3 text-white tracking-wide">İletişim</h4>
      <ul className="space-y-2">
        <li>
          📧{" "}
          <a
            href="mailto:info@fasadstroy.com"
            className="hover:text-white transition"
          >
            info@fasadstroy.com
          </a>
        </li>
        <li>
          ☎️{" "}
          <a
            href="tel:+74951234567"
            className="hover:text-white transition"
          >
            +7 (495) 123-45-67
          </a>
        </li>
        <li>📍 Moskova, Rusya</li>
      </ul>
    </div>

    {/* SAĞ – SİSTEM */}
    <div>
      <h4 className="mb-3 text-white tracking-wide">Sistem</h4>
      <p className="text-neutral-500">
        Yetkili personel kullanımı içindir.
      </p>
      <p className="mt-2 text-xs text-neutral-600">
        v0.3 • Internal Use
      </p>
    </div>

  </div>

  {/* ALT ÇİZGİ */}
  <div className="mt-12 text-center text-xs text-neutral-600">
    © {new Date().getFullYear()} Fasad Stroy. Tüm hakları saklıdır.
  </div>
</footer>


      {/* 🔧 ANİMASYONLAR */}
      <style jsx global>{`
        @keyframes heroZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.08);
          }
        }

        .animate-heroZoom {
          animation: heroZoom 22s ease-in-out infinite alternate;
          will-change: transform;
        }


        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1.6s ease-out forwards;
        }
      `}</style>

<style jsx>{`
@keyframes noiseMove {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2%, 2%); }
  50% { transform: translate(2%, -2%); }
  75% { transform: translate(-1%, -1%); }
  100% { transform: translate(0, 0); }
}

.animate-noise {
  animation: noiseMove 6s steps(2) infinite;
}
`}</style>

    </main>
  );
}
