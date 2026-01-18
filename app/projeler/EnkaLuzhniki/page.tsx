"use client";

import { useEffect, useState } from "react";

/* ===== DASHBOARD UI YARDIMCILARI (EKLENDİ) ===== */
const riskColor = (status?: string) => {
  if (status === "good") return "text-green-400";
  if (status === "bad") return "text-red-400";
  return "text-yellow-400";
};

const progressColor = (percent: number) => {
  if (percent >= 80) return "bg-green-500";
  if (percent >= 50) return "bg-yellow-500";
  return "bg-red-500";
};


const getNumber = (b: any, keys: string[]) => {
  for (const k of keys) {
    if (typeof b[k] === "number") return b[k];
  }
  return 0;
};


const getBlockToplam = (b: any) =>
  getNumber(b, ["toplam", "toplamAdet", "blokToplam", "total", "adet"]) ?? 0;

const getBlockSevkiyat = (b: any) =>
  getNumber(b, ["sevkiyat", "sevkiyatAdet", "sevkiyatToplam"]) ?? 0;

const getBlockMontaj = (b: any) =>
  getNumber(b, ["montaj", "montajAdet", "montajToplam"]) ?? 0;



const formatBlokTahminiBitis = (b: any) => {
  // ❌ Veri yok olanları tamamen gizle
  if (!b.dateStr || b.dateStr.toLowerCase().includes("veri yok")) {
    return null;
  }

  // 🔹 kalan modül (hangi isimle gelirse gelsin)
  const kalan =
    typeof b.kalan === "number"
      ? b.kalan
      : typeof b.kalanModul === "number"
      ? b.kalanModul
      : typeof b.kalanModül === "number"
      ? b.kalanModül
      : null;

  const kalanText =
    kalan !== null ? `, Kalan: ${kalan}` : "";

  // 🔹 son 7 gün ort
  const ortText =
    typeof b.avgMonLast7 === "number"
      ? `, Son 7g ort: ${b.avgMonLast7.toFixed(1)}/gün`
      : "";

  // 🔹 gün bilgisi
  const gunText =
    typeof b.days === "number"
      ? `≈ ${b.days} gün`
      : "";

  return `${b.name} → ${b.dateStr} (${gunText}${kalanText}${ortText})`;
};



const parseProgressLine = (line: string) => {
  // Ayarlama – 32 / 450 (%7.1)
  const match = line.match(
    /^(.+?)\s*–\s*(\d+)\s*\/\s*(\d+)\s*\(%([\d.]+)\)/
  );

  if (!match) return null;

  return {
    label: match[1],
    done: Number(match[2]),
    total: Number(match[3]),
    percent: Number(match[4]),
  };
};


const calcYerdekiPanel = (b: any) => {
  const gelen = b.gelen ?? 0;
  const takilan = b.takilan ?? 0;

  return {
    toplam: Math.max(gelen - takilan, 0),
  };
};



const splitProgressByBlock = (html: string) => {
  const lines = html
    .split("<br>")
    .map(l => l.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);

  const blocks: {
    name: string;
    items: {
      label: string;
      done: number;
      total: number;
      percent: number;
    }[];
  }[] = [];

  let currentBlock: any = null;

  lines.forEach(line => {
    const parsed = parseProgressLine(line);

    // BLOK BAŞLIĞI (C2 Blok, A1 Blok)
    if (!parsed) {
      currentBlock = { name: line, items: [] };
      blocks.push(currentBlock);
    } 
    // BLOK İÇİ SATIR
    else if (currentBlock) {
      currentBlock.items.push(parsed);
    }
  });

  return blocks;
};




/* ===== GAS SIDEBAR JSON ===== */
type SidebarData = {
  aktifPersonel: number;
  giris: number;
  cikis: number;
  bolumSayilari: Record<string, number>;
  bolumGelmeyen: Record<string, number>;
  bolumIzinde: Record<string, number>;
  gunlukGelmeyenListe: string[];
  izindeListe: string[];
};

type Personel = {
  id: string;
  ad: string;
  soyad: string;
  unvan: string;
  bolum: string;
  durum: string;
  foto: string;
};

export default function EnkaLuzhnikiPage() {
  /* ===== ÜST SEKME ===== */
  const [activeTab, setActiveTab] = useState<"kadro" | "ilerleme">("kadro");

  /* ===== PROJE İLERLEME ALT SEKME ===== */
  const [ilerlemeTab, setIlerlemeTab] = useState<
  "dashboard" | "ilerleme" | "gorsel"
>("dashboard");


  /* ===== MEVCUT STATE’LER (DOKUNULMADI) ===== */
  const [kadro, setKadro] = useState<Personel[]>([]);
  const [sidebar, setSidebar] = useState<SidebarData | null>(null);

  /* ===== YENİ STATE’LER ===== */
  const [dashboard, setDashboard] = useState<any>(null);
  const [ilerleme, setIlerleme] = useState<any>(null);

  useEffect(() => {
    /* === MEVCUT FETCHLER (AYNEN) === */

    fetch("/api/sidebar")
      .then(r => r.json())
      .then(d => setSidebar(d));

    /* === YENİ FETCHLER === */
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(setDashboard);

    fetch("/api/ilerleme")
      .then(r => r.json())
      .then(setIlerleme);
  }, []);

  // ===== GENEL İLERLEME HESAPLARI (EKLENDİ) =====
  const sevIlerleme =
    dashboard?.toplamProje && dashboard?.toplamGelen
      ? (dashboard.toplamGelen / dashboard.toplamProje) * 100
      : 0;

  const monIlerleme =
    dashboard?.toplamProje && dashboard?.toplamTakilan
      ? (dashboard.toplamTakilan / dashboard.toplamProje) * 100
      : 0;

  // E-tablodaki hedef oranlar (sabit)
  const sevBeklenen = 64.7;
  const monBeklenen = 41.9;

const isLoading =
  (activeTab === "kadro" && !sidebar) ||
  (activeTab === "ilerleme" && (
    (ilerlemeTab === "dashboard" && !dashboard) ||
    (ilerlemeTab === "ilerleme" && !ilerleme)
  ));



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

<>
  {isLoading && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
        <span className="text-sm text-neutral-300">Yükleniyor…</span>
      </div>
    </div>
  )}

    <main className="min-h-screen bg-black text-white pt-28 px-6">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-light mb-6">Enka Luzhniki</h1>

        {/* ===== ÜST SEKME ===== */}
        <div className="flex gap-6 border-b border-neutral-700 mb-6">
          <button
            onClick={() => setActiveTab("kadro")}
            className={`pb-3 text-sm ${
              activeTab === "kadro"
                ? "text-white border-b-2 border-white"
                : "text-neutral-400"
            }`}
          >
            Proje Kadrosu
          </button>

          <button
            onClick={() => setActiveTab("ilerleme")}
            className={`pb-3 text-sm ${
              activeTab === "ilerleme"
                ? "text-white border-b-2 border-white"
                : "text-neutral-400"
            }`}
          >
            Proje İlerleme
          </button>
        </div>

        {/* =====================================================
            PROJE KADROSU – SENİN KODUN (HİÇ BOZULMADI)
        ====================================================== */}
        {activeTab === "kadro" && (
          <div className="space-y-6">

            {/* ===== ÜST ÖZET ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-neutral-900 p-4">
                <p className="text-xs text-neutral-400">Aktif Personel</p>
                <p className="text-2xl font-semibold text-green-400">
                  {sidebar?.aktifPersonel ?? "–"}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-900 p-4">
                <p className="text-xs text-neutral-400">İzinde Olanlar</p>
                <p className="text-2xl font-semibold text-yellow-400">
                  {sidebar?.izindeListe.length ?? "–"}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-900 p-4">
                <p className="text-xs text-neutral-400">Son 7 Gün Hareket</p>
                <p className="text-sm mt-1">
                  ➡️ Giriş: <b>{sidebar?.giris ?? "–"}</b>
                </p>
                <p className="text-sm">
                  ⬅️ Çıkış: <b>{sidebar?.cikis ?? "–"}</b>
                </p>
              </div>
            </div>

            {/* ===== PERSONEL SAYI BİLGİLERİ ===== */}
            <div className="rounded-xl bg-neutral-900 p-4">
              <h4 className="text-sm mb-2">👥 Personel Sayı Bilgileri</h4>

              {!sidebar ? (
                <p>Yükleniyor…</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {Object.entries(sidebar.bolumSayilari).map(
                    ([bolum, toplam]) => (
                      <li key={bolum}>
                        • {bolum}: <b>{toplam}</b>
                        {sidebar.bolumGelmeyen[bolum] > 0 && (
                          <span className="text-red-400">
                            {" "}
                            ({sidebar.bolumGelmeyen[bolum]} Gelmedi)
                          </span>
                        )}
                        {sidebar.bolumIzinde[bolum] > 0 && (
                          <span className="text-yellow-400">
                            {" "}
                            ({sidebar.bolumIzinde[bolum]} İzinde)
                          </span>
                        )}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            {/* ===== GÜNLÜK GELMEYENLER ===== */}
            <div className="rounded-xl bg-neutral-900 p-4">
              <h4 className="text-sm mb-2">
                🚨 Günlük Gelmeyenler ({sidebar?.gunlukGelmeyenListe.length || 0})
              </h4>

              {!sidebar || sidebar.gunlukGelmeyenListe.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  Bugün gelmeyen yok
                </p>
              ) : (
                <ul className="text-sm">
                  {sidebar.gunlukGelmeyenListe.map((i, idx) => (
                    <li key={idx}>• {i}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* ===== İZİNDE OLANLAR ===== */}
            <div className="rounded-xl bg-neutral-900 p-4">
              <h4 className="text-sm mb-2">
                🟡 İzinde Olan Personel ({sidebar?.izindeListe.length || 0})
              </h4>

              {!sidebar ? (
                <p className="text-sm text-neutral-400">Yükleniyor…</p>
              ) : sidebar.izindeListe.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  Bugün izinde olan personel yok
                </p>
              ) : (
                <ul className="text-sm space-y-1">
                  {sidebar.izindeListe.map((i, idx) => (
                    <li key={idx}>• {i}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* ===== PERSONEL KARTLARI ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kadro.map(p => (
                <div key={p.id} className="rounded-xl bg-neutral-900 p-4">
                  <img
                    src={p.foto || "/images/person-placeholder.jpg"}
                    className="h-40 w-full object-cover rounded-md mb-3"
                  />
                  <div className="font-medium">
                    {p.ad} {p.soyad}
                  </div>
                  <div className="text-xs text-neutral-400">{p.unvan}</div>
                  <div className="text-xs text-neutral-500">{p.bolum}</div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =====================================================
            PROJE İLERLEME – TAM HALİ
        ====================================================== */}
        {activeTab === "ilerleme" && (
          <div>

            {/* ALT SEKME */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIlerlemeTab("dashboard")}
                className={`px-4 py-2 rounded ${
                  ilerlemeTab === "dashboard"
                    ? "bg-white text-black"
                    : "bg-neutral-800"
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setIlerlemeTab("ilerleme")}
                className={`px-4 py-2 rounded ${
                  ilerlemeTab === "ilerleme"
                    ? "bg-white text-black"
                    : "bg-neutral-800"
                }`}
              >
                İlerleme
              </button>

<button
  onClick={() => setIlerlemeTab("gorsel")}
  className={`px-4 py-2 rounded ${
    ilerlemeTab === "gorsel"
      ? "bg-white text-black"
      : "bg-neutral-800"
  }`}
>
  Sevkiyat & Montaj Görsel İlerleme
</button>

            </div>

            {/* DASHBOARD */}
            {ilerlemeTab === "dashboard" && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* =======================
        SOL – BLOKLAR (ALT ALTA)
    ======================= */}
    <div className="space-y-4">

      {/* GENEL ÖZET KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-neutral-900 p-4">
          <p className="text-xs text-neutral-400">Toplam Proje</p>
          <p className="text-2xl font-semibold text-blue-400">
            {dashboard?.toplamProje ?? "–"}
          </p>
        </div>

        <div className="rounded-xl bg-neutral-900 p-4">
          <p className="text-xs text-neutral-400">Sevkiyat</p>
          <p className="text-lg">{dashboard?.toplamGelen ?? "–"}</p>
        </div>

        <div className="rounded-xl bg-neutral-900 p-4">
          <p className="text-xs text-neutral-400">Montaj</p>
          <p className="text-lg">{dashboard?.toplamTakilan ?? "–"}</p>
        </div>
      </div>

      {/* BLOK KARTLARI – ALT ALTA */}
      {dashboard?.blocks?.map((b: any) => {
  const toplam = b.totalPlan ?? 0;
  const sevkiyat = b.gelen ?? 0;
  const montaj = b.takilan ?? 0;

  return (
    <div key={b.name} className="rounded-xl bg-neutral-900 p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">{b.name} Blok</h4>
        <span className={`text-xs ${riskColor(b.status)}`}>
          {b.status}
        </span>
      </div>

      <p className="text-xs">
        Sevkiyat <b>{sevkiyat} / {toplam}</b> (%{b.sevkiyatYuzde})
      </p>

      <div className="w-full h-2 bg-neutral-700 rounded mb-2">
        <div
          className={`h-2 rounded ${progressColor(b.sevkiyatYuzde)}`}
          style={{ width: `${b.sevkiyatYuzde}%` }}
        />
      </div>

      <p className="text-xs">
        Montaj <b>{montaj} / {toplam}</b> (%{b.montajYuzde})
      </p>

      <div className="w-full h-2 bg-neutral-700 rounded">
        <div
          className={`h-2 rounded ${progressColor(b.montajYuzde)}`}
          style={{ width: `${b.montajYuzde}%` }}
        />
      </div>

      <p className="text-xs text-neutral-400 mt-2">
        Son 7g ort: {b.avgMonLast7?.toFixed(1) ?? 0}
      </p>
    </div>
  );
})}



    </div>

    {/* =======================
        SAĞ – BİLGİ PANELİ
    ======================= */}
    <div className="space-y-4">

      {/* GENEL İLERLEME */}
<div className="rounded-xl bg-neutral-900 p-4 text-sm whitespace-pre-line">
  <h4 className="mb-2 text-neutral-300">Genel İlerleme</h4>

  <p>
    Toplam Proje: <b>{dashboard?.toplamProje}</b> adet
  </p>

  <p>
    Sevkiyat: <b>{dashboard?.toplamGelen}</b>{" "}
    (Kalan: <b>{dashboard?.toplamProje - dashboard?.toplamGelen}</b>)
  </p>

  <p>
  Montaj: <b>{dashboard?.toplamTakilan}</b>{" "}
  (Kalan: <b>{dashboard?.toplamProje - dashboard?.toplamTakilan}</b>)
</p>

<div className="mt-2 border-t border-neutral-700 pt-2">
  <h4 className="mb-2 text-neutral-300">Yerdeki Paneller</h4>

  {dashboard?.blocks?.map((b: any) => {
    const p = calcYerdekiPanel(b);
    if (p.toplam === 0) return null;

    return (
      <p key={b.name}>
        <b>{b.name}:</b> {p.toplam} adet
      </p>
    );
  })}

  <p className="">
    <b>
      Toplam:{" "}
      {dashboard?.blocks?.reduce((sum: number, b: any) => {
        return sum + calcYerdekiPanel(b).toplam;
      }, 0)}{" "}
      adet
    </b>
  </p>
</div>



  <p className="mt-2 border-t border-neutral-700 pt-2">
    Sevkiyat İlerleme:{" "}
    <b>%{sevIlerleme.toFixed(1)}</b>{" "}
  </p>

  <p>
    Montaj İlerleme:{" "}
    <b>%{monIlerleme.toFixed(1)}</b>{" "}
  </p>
</div>



      {/* GENEL TAHMİNİ BİTİŞ */}
      <div className="rounded-xl bg-neutral-900 p-4 text-sm whitespace-pre-line">
  <h4 className="mb-2 text-neutral-300">Genel Tahmini Bitiş</h4>

  <p>Kalan toplam: <b>{dashboard?.kalanGenel}</b> modül</p>
  <p>Bugünkü montaj: <b>{dashboard?.bugunMontaj ?? 0}</b> adet</p>
  <p>
    Son 7 günde günlük ortalama montaj:{" "}
    <b>{dashboard?.avgMonLast7?.toFixed(1)}</b> adet
  </p>

 <p className="mt-1">
  Bu hızla tahmini bitiş:{" "}
  <b>{dashboard?.estDate}</b>
  {(
    dashboard?.kalanGun ??
    dashboard?.estDays ??
    dashboard?.estimateDays ??
    dashboard?.days
  ) !== undefined && (
    <span className="text-neutral-400">
      {" "} (≈ {
        dashboard.kalanGun ??
        dashboard.estDays ??
        dashboard.estimateDays ??
        dashboard.days
      } gün)
    </span>
  )}
</p>



  <p className="mt-3 text-orange-400">
    Tempo düşük, bitiş tarihi riskli olabilir. 🟠
  </p>
</div>


      {/* BLOK BAZLI TAHMİN */}
      <div className="rounded-xl bg-neutral-900 p-4 text-sm">
        <h4 className="mb-2 text-neutral-300">Blok Bazlı Tahmini Bitiş</h4>
        {dashboard?.blockEstimates
  ?.map((b: any) => formatBlokTahminiBitis(b))
  .filter(Boolean)
  .map((text: string, i: number) => (
    <p key={i}>{text}</p>
))}



      </div>

      {/* SON 7 GÜN */}
      <div className="rounded-xl bg-neutral-900 p-4 text-sm">
        <h4 className="mb-2 text-neutral-300">Son 7 Gün (Gelen / Takılan)</h4>
        {dashboard?.history?.map((h: any, i: number) => (
          <p key={i}>
            {h.label} – Sevkiyat +{h.sevDelta}, Montaj +{h.monDelta}
          </p>
        ))}
      </div>

    </div>
  </div>
)}





            {/* İLERLEME */}
{ilerlemeTab === "ilerleme" && ilerleme && (
  <div className="space-y-4">

    {/* TAHMİNİ BİTİŞ – ESKİ HALİYLE */}
    <div className="rounded-xl bg-neutral-900 p-4 text-sm">
      <h4 className="mb-2 text-neutral-300">Tahmini Bitiş</h4>
      <div dangerouslySetInnerHTML={{ __html: ilerleme.estimateHtml }} />
    </div>

    {/* 🔥 İLERLEME ÖZETİ – BLOK BLOK KARTLAR */}
{splitProgressByBlock(ilerleme.progressSummaryHtml || "").map(
  (block, i) => (
    <div
      key={i}
      className="rounded-xl bg-neutral-900 p-4 text-sm"
    >
      {/* BLOK BAŞLIĞI */}
      <h4 className="mb-3 text-sm font-medium">
        {block.name}
      </h4>

      {/* BLOK İÇİ KALEMLER */}
      <div className="space-y-3">
        {block.items.map((item, j) => (
          <div key={j}>
            <p className="text-xs mb-1">
              {item.label}{" "}
              <b>
                {item.done} / {item.total}
              </b>{" "}
              (%{item.percent})
            </p>

            <div className="w-full h-2 bg-neutral-700 rounded">
              <div
                className={`h-2 rounded ${progressColor(item.percent)}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
)}

    {/* DİĞERLER – HİÇ DEĞİŞMEDİ */}
    {[
      ["Günlük Hedef / Gerçekleşen", ilerleme.dailyCompareHtml],
      ["Adam Verimliliği", ilerleme.efficiencyHtml],
      ["Darboğaz Analizi", ilerleme.bottleneckHtml],
      ["Bugünün Odağı", ilerleme.focusHtml],
    ].map(([title, html], i) => (
      <div key={i} className="rounded-xl bg-neutral-900 p-4 text-sm">
        <h4 className="mb-2 text-neutral-300">{title}</h4>
        <div dangerouslySetInnerHTML={{ __html: html as string }} />
      </div>
    ))}

  </div>
)}

{/* =====================
    GÖRSEL İLERLEME (AYRI!) C2
===================== */}
{ilerlemeTab === "gorsel" && (
  <div className="rounded-xl bg-neutral-900 p-4">
    <div className="flex items-start justify-between mb-3">
  <h4 className="text-sm text-neutral-300">
    C2 – Sevkiyat & Montaj Görsel İlerleme
  </h4>

  {/* LEGEND */}
  <div className="flex items-center gap-4 text-xs bg-black/60 px-3 py-2 rounded-md border border-neutral-700">
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-green-500 rounded-sm" />
      <span>Montaj yapılmış</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-red-500 rounded-sm" />
      <span>Kule vinç ayakları / Alimak</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-neutral-300 rounded-sm" />
      <span>Sevkiyat yapılmadı</span>
    </div>
  </div>
</div>



    {/* DIŞ KUTU */}
    <div
      className="border border-neutral-700 rounded-lg overflow-x-auto overflow-y-hidden"
      style={{
        height: "560px",
        maxWidth: "100%",
      }}
    >


      {/* İÇ KUTU (SADECE SAĞA GİDEBİLİR) */}
      <div
        style={{
          width: "2400px", // 🔥 2. / 3. / 4. öncelik için GENİŞ
          height: "420px",
          pointerEvents: "none",
        }}
      >


        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTk7P1M7_-hj7u3DR6cXwgq0LKKfSlhLXUczMp8a33wnbJCYlf8G4xxJonSpAP74BuFipCKTw9BlY_n/pubhtml?gid=989525659&single=true"
          style={{
            width: "5000px",
            height: "20000px",
            border: "0",

            /* 👇 ASIL KRİTİK KISIM */
            transform: `
              scale(0.6)
              translateX(-920px)   /* ❌ SOL TABLO TAMAMEN YOK */
              translateY(-100px)    /* 16–8. KAT ARALIĞI */
            `,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>

    <p className="mt-2 text-xs text-neutral-500">
      Google E-Tablo İle Senkronize Edildi.
    </p>
  </div>
)}

{/* ===== BLOK AYIRICI ===== */}
<div className="relative my-10">
  {/* çizgi */}
  <div className="h-px bg-neutral-700 w-full" />

  {/* ortadaki vurgu */}
  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-4 text-xs text-neutral-400">
  </div>
</div>



{/* =====================
    GÖRSEL İLERLEME (AYRI!) A1
===================== */}
{ilerlemeTab === "gorsel" && (
  <div className="rounded-xl bg-neutral-900 p-4">
    <div className="flex items-start justify-between mb-3">
  <h4 className="text-sm text-neutral-300">
    A1 – Sevkiyat & Montaj Görsel İlerleme
  </h4>

  {/* LEGEND */}
  <div className="flex items-center gap-4 text-xs bg-black/60 px-3 py-2 rounded-md border border-neutral-700">
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-green-500 rounded-sm" />
      <span>Montaj yapılmış</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-red-500 rounded-sm" />
      <span>Kule vinç ayakları / Alimak</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-neutral-300 rounded-sm" />
      <span>Sevkiyat yapılmadı</span>
    </div>
  </div>
</div>


    {/* DIŞ KUTU */}
    <div
      className="border border-neutral-700 rounded-lg overflow-x-auto overflow-y-hidden"
      style={{
        height: "590px",
        maxWidth: "100%",
      }}
    >
      {/* İÇ KUTU (SADECE SAĞA GİDEBİLİR) */}
      <div
        style={{
          width: "2400px", // 🔥 2. / 3. / 4. öncelik için GENİŞ
          height: "420px",
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTk7P1M7_-hj7u3DR6cXwgq0LKKfSlhLXUczMp8a33wnbJCYlf8G4xxJonSpAP74BuFipCKTw9BlY_n/pubhtml?gid=989525659&single=true"
          style={{
            width: "5000px",
            height: "20000px",
            border: "0",

            /* 👇 ASIL KRİTİK KISIM */
            transform: `
              scale(0.6)
              translateX(-920px)   /* ❌ SOL TABLO TAMAMEN YOK */
              translateY(-1040px)    /* 16–8. KAT ARALIĞI */
            `,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>

    <p className="mt-2 text-xs text-neutral-500">
       Google E-Tablo İle Senkronize Edildi.
    </p>
  </div>
)}

{/* ===== BLOK AYIRICI ===== */}
<div className="relative my-10">
  {/* çizgi */}
  <div className="h-px bg-neutral-700 w-full" />

  {/* ortadaki vurgu */}
  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-4 text-xs text-neutral-400">
  </div>
</div>


{/* =====================
    GÖRSEL İLERLEME (AYRI!) C1
===================== */}
{ilerlemeTab === "gorsel" && (
  <div className="rounded-xl bg-neutral-900 p-4">
    <div className="flex items-start justify-between mb-3">
  <h4 className="text-sm text-neutral-300">
    C1 – Sevkiyat & Montaj Görsel İlerleme
  </h4>

  {/* LEGEND */}
  <div className="flex items-center gap-4 text-xs bg-black/60 px-3 py-2 rounded-md border border-neutral-700">
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-green-500 rounded-sm" />
      <span>Montaj yapılmış</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-red-500 rounded-sm" />
      <span>Kule vinç ayakları / Alimak</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-neutral-300 rounded-sm" />
      <span>Sevkiyat yapılmadı</span>
    </div>
  </div>
</div>


    {/* DIŞ KUTU */}
    <div
      className="border border-neutral-700 rounded-lg overflow-x-auto overflow-y-hidden"
      style={{
        height: "590px",
        maxWidth: "100%",
      }}
    >
      {/* İÇ KUTU (SADECE SAĞA GİDEBİLİR) */}
      <div
        style={{
          width: "2400px", // 🔥 2. / 3. / 4. öncelik için GENİŞ
          height: "420px",
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTk7P1M7_-hj7u3DR6cXwgq0LKKfSlhLXUczMp8a33wnbJCYlf8G4xxJonSpAP74BuFipCKTw9BlY_n/pubhtml?gid=989525659&single=true"
          style={{
            width: "5000px",
            height: "20000px",
            border: "0",

            /* 👇 ASIL KRİTİK KISIM */
            transform: `
              scale(0.6)
              translateX(-920px)   /* ❌ SOL TABLO TAMAMEN YOK */
              translateY(-2030px)    /* 16–8. KAT ARALIĞI */
            `,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>

    <p className="mt-2 text-xs text-neutral-500">
       Google E-Tablo İle Senkronize Edildi.
    </p>
  </div>
)}

{/* ===== BLOK AYIRICI ===== */}
<div className="relative my-10">
  {/* çizgi */}
  <div className="h-px bg-neutral-700 w-full" />

  {/* ortadaki vurgu */}
  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-4 text-xs text-neutral-400">
  </div>
</div>


{/* =====================
    GÖRSEL İLERLEME (AYRI!) A2
===================== */}
{ilerlemeTab === "gorsel" && (
  <div className="rounded-xl bg-neutral-900 p-4">
    <div className="flex items-start justify-between mb-3">
  <h4 className="text-sm text-neutral-300">
    A2 – Sevkiyat & Montaj Görsel İlerleme
  </h4>

  {/* LEGEND */}
  <div className="flex items-center gap-4 text-xs bg-black/60 px-3 py-2 rounded-md border border-neutral-700">
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-green-500 rounded-sm" />
      <span>Montaj yapılmış</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-red-500 rounded-sm" />
      <span>Kule vinç ayakları / Alimak</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-neutral-300 rounded-sm" />
      <span>Sevkiyat yapılmadı</span>
    </div>
  </div>
</div>


    {/* DIŞ KUTU */}
    <div
      className="border border-neutral-700 rounded-lg overflow-x-auto overflow-y-hidden"
      style={{
        height: "590px",
        maxWidth: "100%",
      }}
    >
      {/* İÇ KUTU (SADECE SAĞA GİDEBİLİR) */}
      <div
        style={{
          width: "2500px", // 🔥 2. / 3. / 4. öncelik için GENİŞ
          height: "420px",
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTk7P1M7_-hj7u3DR6cXwgq0LKKfSlhLXUczMp8a33wnbJCYlf8G4xxJonSpAP74BuFipCKTw9BlY_n/pubhtml?gid=989525659&single=true"
          style={{
            width: "5300px",
            height: "20000px",
            border: "0",

            /* 👇 ASIL KRİTİK KISIM */
            transform: `
              scale(0.6)
              translateX(-920px)   /* ❌ SOL TABLO TAMAMEN YOK */
              translateY(-3030px)    /* 16–8. KAT ARALIĞI */
            `,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>

    <p className="mt-2 text-xs text-neutral-500">
       Google E-Tablo İle Senkronize Edildi.
    </p>
  </div>
)}

{/* ===== BLOK AYIRICI ===== */}
<div className="relative my-10">
  {/* çizgi */}
  <div className="h-px bg-neutral-700 w-full" />

  {/* ortadaki vurgu */}
  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-4 text-xs text-neutral-400">
  </div>
</div>

{/* =====================
    GÖRSEL İLERLEME (AYRI!) A3
===================== */}
{ilerlemeTab === "gorsel" && (
  <div className="rounded-xl bg-neutral-900 p-4">
    <div className="flex items-start justify-between mb-3">
  <h4 className="text-sm text-neutral-300">
    A3 – Sevkiyat & Montaj Görsel İlerleme
  </h4>

  {/* LEGEND */}
  <div className="flex items-center gap-4 text-xs bg-black/60 px-3 py-2 rounded-md border border-neutral-700">
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-green-500 rounded-sm" />
      <span>Montaj yapılmış</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-red-500 rounded-sm" />
      <span>Kule vinç ayakları / Alimak</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-3 h-3 bg-neutral-300 rounded-sm" />
      <span>Sevkiyat yapılmadı</span>
    </div>
  </div>
</div>



    {/* DIŞ KUTU */}
    <div
      className="border border-neutral-700 rounded-lg overflow-x-auto overflow-y-hidden"
      style={{
        height: "590px",
        maxWidth: "100%",
      }}
    >
      {/* İÇ KUTU (SADECE SAĞA GİDEBİLİR) */}
      <div
        style={{
          width: "2500px", // 🔥 2. / 3. / 4. öncelik için GENİŞ
          height: "420px",
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTk7P1M7_-hj7u3DR6cXwgq0LKKfSlhLXUczMp8a33wnbJCYlf8G4xxJonSpAP74BuFipCKTw9BlY_n/pubhtml?gid=989525659&single=true"
          style={{
            width: "5300px",
            height: "20000px",
            border: "0",

            /* 👇 ASIL KRİTİK KISIM */
            transform: `
              scale(0.6)
              translateX(-920px)   /* ❌ SOL TABLO TAMAMEN YOK */
              translateY(-4020px)    /* 16–8. KAT ARALIĞI */
            `,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>

    <p className="mt-2 text-xs text-neutral-500">
       Google E-Tablo İle Senkronize Edildi.
    </p>
  </div>
)}


{/* ===== BLOK AYIRICI ===== */}
<div className="relative my-10">
  {/* çizgi */}
  <div className="h-px bg-neutral-700 w-full" />

  {/* ortadaki vurgu */}
  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-4 text-xs text-neutral-400">
  </div>
</div>

          </div>
        )}
      </div>
    </main>

</>
);
}
