import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AdCommander", template: "%s · AdCommander" },
  description: "Meta Ads campaign management powered by Claude AI & Andromeda intelligence",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-900 text-white">
        {children}
      </body>
    </html>
  );
}
