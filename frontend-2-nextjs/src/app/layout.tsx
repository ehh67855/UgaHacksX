import "@/styles/globals.css";
import { type Metadata } from "next";
import { geistMono, geistSans } from "@/lib/fonts";
import { ToastProvider } from "@/components/ui/toast";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/providers";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: "Like Git -- but for audio engineers.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
