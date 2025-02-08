import "@/styles/globals.css";
import { type Metadata } from "next";
import { geistMono, geistSans } from "@/lib/fonts";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { isAuthenticated } from "@/services/BackendService";

export const metadata: Metadata = {
  title: "MixStash",
  description: "Like Git -- but for audio engineers.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const isAuthed = await isAuthenticated();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* <Header isAuthed={isAuthed} />
        <main className="flex-1">{children}</main>
        <Footer /> */}
      </body>
    </html>
  );
}
