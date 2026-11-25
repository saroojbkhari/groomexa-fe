import { faqs } from "@/constants/home";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { faqSchema, softwareSchema } from "@/utils/structuredData";
import { Faq, Features, FinalCta, Hero, Highlights, HowItWorks, Pricing } from "./components";

/** Marketing home page. */
export default function Home() {
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
