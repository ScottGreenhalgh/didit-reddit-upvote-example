import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";
import { Providers } from "@/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Didit",
  description: "A social app like Reddit or Hacker News",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="max-w-screen-xl lg:mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
