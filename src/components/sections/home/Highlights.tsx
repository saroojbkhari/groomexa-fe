import { highlights } from "@/content/home";

export function Highlights() {
  return (
    <section aria-label="Key capabilities" className="bg-ink text-cream">
      <ul className="container-page grid grid-cols-1 gap-4 py-7 font-semibold sm:grid-cols-2 lg:flex lg:justify-between">
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
