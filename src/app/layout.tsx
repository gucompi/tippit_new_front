import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import "@/styles/globals.scss";
import { TRPCProvider } from "@/components/providers/TRPCProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tippit - Restaurant Management",
  description: "Manage your restaurant tips and staff efficiently",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body className={`${inter.variable} antialiased`}>
          <NextIntlClientProvider messages={messages}>
            <TRPCProvider>
              <ThemeProvider>
                {children}
                <Toaster position="top-right" />
              </ThemeProvider>
            </TRPCProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
