import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Fasad Stroy",
  description: "Operasyon & Saha Yönetim Paneli",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-black text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
