import Hero     from '@/components/sections/Hero';
import StatsBar from '@/components/sections/StatsBar';
import Services from '@/components/sections/Services';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <StatsBar />
      <Services />
    </main>
  );
}
