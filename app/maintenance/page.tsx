import MaintenanceView from '@/components/MaintenanceView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BetaVolt – 404 // المنصة قيد الصيانة والتطوير',
  description: 'الموقع الرسمي لشركة BetaVolt للهندسة والمقاولات - المنصة تخضع لأعمال الصيانة والتطوير الدوري.',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return <MaintenanceView />;
}
