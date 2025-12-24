import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Restaurant - Tippit',
  description: 'View your restaurant statistics and performance',
};

export default function BusinessLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

