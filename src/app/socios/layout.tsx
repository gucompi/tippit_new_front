import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socios - Tippit',
  description: 'Restaurant statistics and analytics dashboard',
};

export default function SociosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

