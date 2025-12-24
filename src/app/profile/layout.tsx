import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - Tippit',
  description: 'View and edit your profile information',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

