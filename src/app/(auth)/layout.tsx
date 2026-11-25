import Logo from "@/components/Logo";
import Icon from "@/components/Icon";

const POINTS = [
  "Online booking that only offers slots the dog actually fits",
  "Automatic reminders and deposits that cut no-shows",
  "Every dog's handling notes in front of every groomer",
];

/** Shared shell for log in, sign up and password reset. Brand panel shows on large screens only. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden flex-col justify-between bg-ink p-12 text-cream lg:flex">
        <Logo inverted className="self-start text-cream" />
        <div>
          <p className="font-display text-[44px] leading-[1.05] font-extrabold tracking-tight text-balance">Fill every slot. Skip the no-shows.</p>
          <ul className="mt-8 flex flex-col gap-4 text-lg text-mint">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3">
                <Icon name="check" size={24} strokeWidth={2.2} className="mt-0.5 shrink-0 text-coral" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-mist">Built for independent salons with one to five groomers.</p>
      </aside>
      <div className="flex flex-col bg-cream px-4 py-6 sm:px-8">
        <Logo className="self-start lg:hidden" />
        <main id="main" className="flex flex-1 items-center justify-center py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
