// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Leaks Viewer",
  description: "Browse known data breaches",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-white text-zinc-700 transition-colors duration-300 dark:bg-zinc-900 dark:text-white
`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
