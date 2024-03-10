import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { HeroImageBackground } from '@/components/HeroImageBackground/HeroImageBackground';
import { FeaturesSection } from '@/components/FeaturesSection/FeaturesSection';
import { FAQ } from '@/components/FAQ/FAQ';
import { Footer } from '@/components/Footer/Footer';

export default function HomePage() {
  return (
    <>
      <HeaderMegaMenu />
      <HeroImageBackground />
      <FeaturesSection />
      <FAQ />
      <Footer />
    </>
  );
}
