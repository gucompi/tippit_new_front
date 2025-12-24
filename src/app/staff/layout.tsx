import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Staff - Tippit',
  description: 'Manage your staff and roles',
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

