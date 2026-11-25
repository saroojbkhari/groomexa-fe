import { faqs } from "@/constants/home";
import Icon from "@/components/Icon";
import Section from "@/components/Section";

export default function Faq() {
  return (
    <Section id="faq" centered title="Questions, answered.">
      <div className="mx-auto flex max-w-[816px] flex-col gap-3">
        {faqs.map((item) => (
          <details key={item.question} className="group rounded-[18px] bg-white px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <Icon name="chevron" size={20} className="shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3.5 leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
