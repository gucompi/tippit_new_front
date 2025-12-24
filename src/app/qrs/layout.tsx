import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My QRs - Tippit',
  description: 'Manage your QR codes for tables',
};

export default function QRsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

