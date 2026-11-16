import { faqs } from "@/content/home";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq, Features, FinalCta, Hero, Highlights, HowItWorks, Pricing } from "@/components/sections/home";
import { faqSchema, softwareSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema(faqs)} />
      <Header />
      <main>
        <Hero />
        <Highlights />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
