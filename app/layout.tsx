import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nodex | JSON Visualizer",
  description: "A local-first, high-performance JSON visualizer",
  keywords: [
    "JSON",
    "Visualizer",
    "Graph",
    "Developer Tool",
    "React Flow",
    "Local-first",
  ],
  authors: [{ name: "Riki Kashyap", url: "https://rikikashyap.dev" }],
  creator: "Riki Kashyap",
  openGraph: {
    title: "Nodex | JSON Visualizer",
    description: "A local-first, high-performance JSON visualizer.",
    url: "https://nodex-jv.vercel.app",
    siteName: "Nodex",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nodex - JSON Graph Visualizer Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nodex | JSON Visualizer",
    description: "A local-first, high-performance JSON visualizer.",
    images: ["/og-image.png"],
    creator: "@rikiKDev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
