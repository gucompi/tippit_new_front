import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gift Cards - Tippit',
  description: 'Manage and create gift cards for your customers',
};

export default function GiftCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

