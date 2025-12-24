import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Tippit',
  description: 'Your dashboard with tips and payments overview',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

