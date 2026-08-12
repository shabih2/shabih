import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'سفير | Safeer – منصة تسويق بالإحالة',
  description: 'منصة سفير للتسويق بالإحالة – اربط المطاعم بالسفراء والعملاء',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
