import MaintenanceView from '@/components/MaintenanceView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BetaVolt – 404 // المنصة قيد الصيانة والتطوير',
  description: 'الصفحة غير موجودة أو قيد الصيانة - BetaVolt للهندسة والمقاولات',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <MaintenanceView />;
}
