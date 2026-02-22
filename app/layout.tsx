import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tré Kante Family Recipes",
  description: "A collection of treasured family recipes from the Kante family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


