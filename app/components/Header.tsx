"use client";

import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

const [weather, setWeather] = useState<any>(null);

useEffect(() => {
  fetch("/api/weather")
    .then(res => res.json())
    .then(setWeather)
    .catch(() => setWeather(null));
}, []);


  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-black/50 backdrop-blur-sm">
  <div className="relative mx-auto flex h-16 max-w-7xl items-center px-6">

    {/* SOL – MENU */}
    <div className="flex-1">
      <button onClick={() => setMenuOpen(true)}>
        <MenuIcon className="h-6 w-6" />
      </button>
    </div>

    {/* ORTA – LOGO (GERÇEK MERKEZ) */}
    <div className="absolute left-1/2 -translate-x-1/2">
      <Link
        href="/"
        className="text-lg tracking-[0.4em] font-light hover:opacity-80"
      >
        FASAD STROY
      </Link>
    </div>

    {/* SAĞ – TARİH + HAVA */}
    <div className="flex flex-1 justify-end">
      <div className="flex items-center gap-3 text-xs text-neutral-400">
        <span>{new Date().toLocaleDateString("tr-TR")}</span>

        {weather && (
          <span className="flex items-center gap-2 text-neutral-300">
            <span>{weather.icon}</span>
            <span>Moskova</span>
            <span>{weather.temp}°C</span>
          </span>
        )}
      </div>
    </div>

  </div>
</header>


      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-5 right-6"
              onClick={() => setMenuOpen(false)}
            >
              <XIcon className="h-6 w-6" />
            </button>

            <div className="pt-24 flex justify-center">
              <nav className="space-y-6 text-3xl">
                <Link
                  href="/projeler"
                  className="block rounded-2xl bg-white/5 px-14 py-5 text-center hover:bg-white/10"
                >
                  Projeler
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
