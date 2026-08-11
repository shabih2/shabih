import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'شبيح | Shabih – منصة تسويق بالإحالة',
  description: 'منصة شبيح للتسويق بالإحالة – اربط المطاعم بالسفراء والعملاء',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
