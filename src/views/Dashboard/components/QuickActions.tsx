import Link from "next/link";
import { routes } from "@/config/site";
import Icon, { type IconName } from "@/components/Icon";

const ACTIONS: { label: string; href: string; icon: IconName }[] = [
  { label: "New visit", href: routes.newVisit, icon: "plus" },
  { label: "Schedule", href: routes.calendar, icon: "calendar" },
  { label: "Add pet", href: routes.pets, icon: "paw" },
  { label: "View clients", href: routes.clients, icon: "user" },
];

/** Shortcut tiles to the most common tasks. */
export default function QuickActions() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {ACTIONS.map((action) => (
        <li key={action.label}>
          <Link
            href={action.href}
            className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-edge bg-white px-4 py-6 text-center shadow-[0_1px_2px_rgba(14,47,46,0.05)] transition-colors hover:border-stone hover:bg-cream sm:py-8"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-mint text-teal transition-colors group-hover:bg-ink group-hover:text-coral sm:size-14">
              <Icon name={action.icon} size={24} />
            </span>
            <span className="text-[15px] font-semibold">{action.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
