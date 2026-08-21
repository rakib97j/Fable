import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fable",
  description: "Ebook Store and Reader Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-[#0d0d0f] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
        
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        
      </body>
    </html>
  );
}


