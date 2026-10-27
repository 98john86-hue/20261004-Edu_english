import { LevelProvider } from '@/components/LevelContext';
import { Benefits } from '@/components/sections/Benefits';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { LevelSelect } from '@/components/sections/LevelSelect';
import { LogDemo } from '@/components/sections/LogDemo';
import { LogExamples } from '@/components/sections/LogExamples';
import { ProgressPreview } from '@/components/sections/ProgressPreview';
import { SignupSection } from '@/components/sections/SignupSection';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { SiteHeader } from '@/components/sections/SiteHeader';
import { Testimonials } from '@/components/sections/Testimonials';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <HowItWorks />
        <LogExamples />
        <LogDemo />
        <Benefits />
        <LevelProvider>
          <LevelSelect />
          <ProgressPreview />
          <Testimonials />
          <Faq />
          <SignupSection />
        </LevelProvider>
      </main>
      <SiteFooter />
    </>
  );
}
