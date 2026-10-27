import { LevelProvider } from '@/components/LevelContext';
import { Benefits } from '@/components/sections/Benefits';
import { Faq } from '@/components/sections/Faq';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { LevelSelect } from '@/components/sections/LevelSelect';
import { LogExamples } from '@/components/sections/LogExamples';
import { SignupCta } from '@/components/sections/SignupCta';
import { SiteHeader } from '@/components/sections/SiteHeader';
import { Testimonials } from '@/components/sections/Testimonials';
import { WeeklyBoard } from '@/components/sections/WeeklyBoard';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <HowItWorks />
        <LogExamples />
        <WeeklyBoard />
        <Benefits />
        <LevelProvider>
          <LevelSelect />
          <Testimonials />
          <Faq />
          <SignupCta />
        </LevelProvider>
      </main>
      <Footer />
    </>
  );
}
