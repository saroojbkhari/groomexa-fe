import { features } from "@/constants/home";
import Icon from "@/components/Icon";
import Section from "@/components/Section";

export default function Features() {
  return (
    <Section id="features" eyebrow="Everything in one place" title="The back office your salon never had time to build.">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <li key={f.title} className="rounded-3xl bg-white p-7 md:p-8">
            <Icon name={f.icon} size={40} />
            <h3 className="mt-5 mb-2 font-display text-2xl font-bold">{f.title}</h3>
            <p className="leading-relaxed text-muted-foreground">{f.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
